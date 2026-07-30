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

package model_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"

	gitmocks "github.com/matrixhub-ai/matrixhub/internal/domain/git/mocks"
	"github.com/matrixhub-ai/matrixhub/internal/domain/model"
	modelmocks "github.com/matrixhub-ai/matrixhub/internal/domain/model/mocks"
	"github.com/matrixhub-ai/matrixhub/internal/domain/project"
)

type projectRepoStub struct {
	project.IProjectRepo
	getProjectByName func(context.Context, string) (*project.Project, error)
}

func newProjectRepoStub() *projectRepoStub {
	return &projectRepoStub{getProjectByName: func(context.Context, string) (*project.Project, error) {
		return &project.Project{Name: "proj"}, nil
	}}
}

func (s *projectRepoStub) GetProjectByName(ctx context.Context, name string) (*project.Project, error) {
	return s.getProjectByName(ctx, name)
}

func TestModelService_EnsureModelReturnsExistingModel(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	modelRepo := modelmocks.NewMockIModelRepo(ctrl)
	gitRepo := gitmocks.NewMockIGitRepo(ctrl)

	want := &model.Model{Name: "model", ProjectName: "proj"}
	modelRepo.EXPECT().
		GetByProjectAndName(ctx, "proj", "model").
		Return(want, nil)

	service := model.NewModelService(modelRepo, nil, gitRepo, newProjectRepoStub(), nil)
	got, err := service.EnsureModel(ctx, "proj", "model")

	require.NoError(t, err)
	require.Same(t, want, got)
}

func TestModelService_EnsureModelCreatesRepoAndModelWhenBothMissing(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	modelRepo := modelmocks.NewMockIModelRepo(ctrl)
	gitRepo := gitmocks.NewMockIGitRepo(ctrl)
	wantErr := errors.New("model not found")
	want := &model.Model{Name: "model", ProjectName: "proj"}

	gomock.InOrder(
		modelRepo.EXPECT().
			GetByProjectAndName(ctx, "proj", "model").
			Return(nil, wantErr),
		gitRepo.EXPECT().
			RepositoryExists(ctx, "models", "proj", "model").
			Return(false, nil),
		gitRepo.EXPECT().
			CreateRepository(ctx, "models", "proj", "model").
			Return(nil),
		modelRepo.EXPECT().
			Create(ctx, &model.Model{Name: "model", ProjectName: "proj"}).
			Return(want, nil),
	)

	service := model.NewModelService(modelRepo, nil, gitRepo, newProjectRepoStub(), nil)
	got, err := service.EnsureModel(ctx, "proj", "model")

	require.NoError(t, err)
	require.Same(t, want, got)
}

func TestModelService_EnsureModelCreatesOnlyModelWhenRepoExists(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	modelRepo := modelmocks.NewMockIModelRepo(ctrl)
	gitRepo := gitmocks.NewMockIGitRepo(ctrl)
	wantErr := errors.New("model not found")
	want := &model.Model{Name: "model", ProjectName: "proj"}

	gomock.InOrder(
		modelRepo.EXPECT().
			GetByProjectAndName(ctx, "proj", "model").
			Return(nil, wantErr),
		gitRepo.EXPECT().
			RepositoryExists(ctx, "models", "proj", "model").
			Return(true, nil),
		modelRepo.EXPECT().
			Create(ctx, &model.Model{Name: "model", ProjectName: "proj"}).
			Return(want, nil),
	)

	service := model.NewModelService(modelRepo, nil, gitRepo, newProjectRepoStub(), nil)
	got, err := service.EnsureModel(ctx, "proj", "model")

	require.NoError(t, err)
	require.Same(t, want, got)
}

func TestModelService_EnsureModelPropagatesModelLookupError(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	modelRepo := modelmocks.NewMockIModelRepo(ctrl)
	gitRepo := gitmocks.NewMockIGitRepo(ctrl)
	wantErr := errors.New("database unavailable")

	modelRepo.EXPECT().
		GetByProjectAndName(ctx, "proj", "model").
		Return(nil, wantErr)

	service := model.NewModelService(modelRepo, nil, gitRepo, newProjectRepoStub(), nil)
	got, err := service.EnsureModel(ctx, "proj", "model")

	require.ErrorIs(t, err, wantErr)
	require.Nil(t, got)
}

func TestModelService_CheckOrSyncFromRemoteReturnsForNonProxyProject(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	modelRepo := modelmocks.NewMockIModelRepo(ctrl)
	gitRepo := gitmocks.NewMockIGitRepo(ctrl)

	service := model.NewModelService(
		modelRepo,
		nil,
		gitRepo,
		&projectRepoStub{getProjectByName: func(context.Context, string) (*project.Project, error) {
			return &project.Project{Name: "proj"}, nil
		}},
		nil,
	)

	err := service.CheckOrSyncFromRemote(ctx, "proj", "model")

	require.NoError(t, err)
}

func TestModelService_CheckOrSyncFromRemoteUsesEnsuredModel(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	modelRepo := modelmocks.NewMockIModelRepo(ctrl)
	gitRepo := gitmocks.NewMockIGitRepo(ctrl)
	registryID := 1

	modelRepo.EXPECT().
		GetByProjectAndName(ctx, "proj", "model").
		Return(&model.Model{
			Name:        "model",
			ProjectName: "proj",
			UpdatedAt:   time.Now().Add(time.Minute),
		}, nil)

	service := model.NewModelService(
		modelRepo,
		nil,
		gitRepo,
		&projectRepoStub{getProjectByName: func(context.Context, string) (*project.Project, error) {
			return &project.Project{Name: "proj", RegistryID: &registryID}, nil
		}},
		nil,
	)

	err := service.CheckOrSyncFromRemote(ctx, "proj", "model")

	require.NoError(t, err)
}

func TestModelService_EnsureModelPropagatesProjectLookupError(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	modelRepo := modelmocks.NewMockIModelRepo(ctrl)
	gitRepo := gitmocks.NewMockIGitRepo(ctrl)
	wantErr := errors.New("project not found")

	service := model.NewModelService(
		modelRepo,
		nil,
		gitRepo,
		&projectRepoStub{getProjectByName: func(context.Context, string) (*project.Project, error) {
			return nil, wantErr
		}},
		nil,
	)

	got, err := service.EnsureModel(ctx, "proj", "model")

	require.ErrorIs(t, err, wantErr)
	require.Nil(t, got)
}
