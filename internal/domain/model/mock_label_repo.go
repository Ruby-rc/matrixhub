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

package model

import (
	"context"
)

// MockLabelRepo is a placeholder implementation of ILabelRepo.
// TODO: Implement proper label repository with database integration.
type MockLabelRepo struct{}

// NewMockLabelRepo creates a new MockLabelRepo instance.
func NewMockLabelRepo() ILabelRepo {
	return &MockLabelRepo{}
}

// ListByCategoryAndScope returns labels by category and scope.
// Currently returns empty list as placeholder.
func (r *MockLabelRepo) ListByCategoryAndScope(ctx context.Context, category, scope string) ([]*Label, error) {
	return []*Label{}, nil
}

// GetByModelID returns labels for a specific model.
// Currently returns empty list as placeholder.
func (r *MockLabelRepo) GetByModelID(ctx context.Context, modelID int64) ([]*Label, error) {
	return []*Label{}, nil
}