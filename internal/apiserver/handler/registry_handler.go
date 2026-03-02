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

package handler

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	registryv1alpha1 "github.com/matrixhub-ai/matrixhub/api/go/v1alpha1"
	"github.com/matrixhub-ai/matrixhub/internal/infra/log"
)

type RegistryHandler struct{}

func NewRegistryHandler() IHandler {
	handler := &RegistryHandler{}
	return handler
}

func (rh *RegistryHandler) RegisterToServer(options *ServerOptions) {
	// Register GRPC Handler
	registryv1alpha1.RegisterRegistriesServer(options.GRPCServer, rh)
	if err := registryv1alpha1.RegisterRegistriesHandlerServer(context.Background(), options.GatewayMux, rh); err != nil {
		log.Errorf("register handler error: %s", err.Error())
	}
}

func (rh *RegistryHandler) ListRegistries(ctx context.Context, request *registryv1alpha1.ListRegistriesRequest) (*registryv1alpha1.ListRegistriesResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (rh *RegistryHandler) GetRegistry(ctx context.Context, request *registryv1alpha1.GetRegistryRequest) (*registryv1alpha1.GetRegistryResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (rh *RegistryHandler) CreateRegistry(ctx context.Context, request *registryv1alpha1.CreateRegistryRequest) (*registryv1alpha1.CreateRegistryResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (rh *RegistryHandler) UpdateRegistry(ctx context.Context, request *registryv1alpha1.UpdateRegistryRequest) (*registryv1alpha1.UpdateRegistryResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (rh *RegistryHandler) DeleteRegistry(ctx context.Context, request *registryv1alpha1.DeleteRegistryRequest) (*registryv1alpha1.DeleteRegistryResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (rh *RegistryHandler) PingRegistry(ctx context.Context, request *registryv1alpha1.PingRegistryRequest) (*registryv1alpha1.PingRegistryResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}
