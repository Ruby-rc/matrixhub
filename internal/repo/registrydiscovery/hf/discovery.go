// Copyright The MatrixHub Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package hf

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/matrixhub-ai/matrixhub/internal/domain/registry"
	"github.com/matrixhub-ai/matrixhub/internal/domain/registrydiscovery"
)

// Discovery implements registrydiscovery.Discovery for the HuggingFace Hub.
type Discovery struct {
	baseURL string
	client  *http.Client
}

// Option configures a Discovery.
type Option func(*Discovery)

// WithTimeout sets the HTTP client timeout.
func WithTimeout(d time.Duration) Option {
	return func(disc *Discovery) {
		disc.client = &http.Client{Timeout: d}
	}
}

// New creates a new HF Discovery with sensible defaults.
func New(opts ...Option) *Discovery {
	d := &Discovery{
		baseURL: "https://huggingface.co",
		client:  &http.Client{Timeout: 60 * time.Second},
	}
	for _, o := range opts {
		o(d)
	}
	return d
}

// endpointBase returns the API base for a registry. A registry configured with
// its own URL (an HF mirror or proxy) must be honoured here, the same way the
// pull path honours it — otherwise discovery would match against the public Hub
// while the actual sync pulls from the mirror.
func (d *Discovery) endpointBase(reg *registry.Registry) string {
	if reg != nil && reg.URL != "" {
		return strings.TrimSuffix(reg.URL, "/")
	}
	return strings.TrimSuffix(d.baseURL, "/")
}

// ListRepositories queries the HuggingFace Hub API and returns matching repositories.
func (d *Discovery) ListRepositories(ctx context.Context, reg *registry.Registry, filter registrydiscovery.Filter) ([]registrydiscovery.RemoteRepository, error) {
	endpoint := "/api/models"
	if filter.ResourceType == "dataset" {
		endpoint = "/api/datasets"
	}

	u := fmt.Sprintf("%s%s?author=%s&limit=100", d.endpointBase(reg), endpoint, filter.Namespace)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
	if err != nil {
		return nil, fmt.Errorf("build hf request: %w", err)
	}

	if basic := registry.AsBasic(reg.GetCredential()); basic != nil {
		req.Header.Set("Authorization", "Bearer "+basic.Password)
	}

	resp, err := d.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("hf discovery request failed: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("hf discovery returned status %d", resp.StatusCode)
	}

	var items []struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&items); err != nil {
		return nil, fmt.Errorf("decode hf response: %w", err)
	}

	var out []registrydiscovery.RemoteRepository
	for _, it := range items {
		parts := strings.SplitN(it.ID, "/", 2)
		if len(parts) != 2 {
			continue
		}
		out = append(out, registrydiscovery.RemoteRepository{
			Namespace:    parts[0],
			Name:         parts[1],
			ResourceType: filter.ResourceType,
		})
	}
	return out, nil
}
