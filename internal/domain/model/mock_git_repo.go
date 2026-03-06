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
	"errors"
)

// MockGitRepo is a placeholder implementation of IGitRepo.
// TODO: Implement proper Git repository operations.
type MockGitRepo struct{}

// NewMockGitRepo creates a new MockGitRepo instance.
func NewMockGitRepo() IGitRepo {
	return &MockGitRepo{}
}

// CreateRepository initializes a Git repository.
// Currently returns unimplemented error.
func (r *MockGitRepo) CreateRepository(ctx context.Context, project, name string) error {
	return errors.New("git operations not yet implemented")
}

// DeleteRepository removes the Git repository.
// Currently returns unimplemented error.
func (r *MockGitRepo) DeleteRepository(ctx context.Context, project, name string) error {
	return errors.New("git operations not yet implemented")
}

// ListRevisions returns all branches and tags for a model.
// Currently returns empty revisions as placeholder.
func (r *MockGitRepo) ListRevisions(ctx context.Context, project, name string) (*Revisions, error) {
	return &Revisions{
		Branches: []*Revision{},
		Tags:     []*Revision{},
	}, nil
}

// ListCommits returns the commit history for a model.
// Currently returns empty list as placeholder.
func (r *MockGitRepo) ListCommits(ctx context.Context, project, name, revision string, page, pageSize int) ([]*Commit, int64, error) {
	return []*Commit{}, 0, nil
}

// GetCommit returns a specific commit by ID.
// Currently returns unimplemented error.
func (r *MockGitRepo) GetCommit(ctx context.Context, project, name, commitID string) (*Commit, error) {
	return nil, errors.New("git operations not yet implemented")
}

// GetTree returns the file tree at a specific revision and path.
// Currently returns empty tree as placeholder.
func (r *MockGitRepo) GetTree(ctx context.Context, project, name, revision, path string) ([]*TreeEntry, error) {
	return []*TreeEntry{}, nil
}

// GetBlob returns the content of a file at a specific revision.
// Currently returns unimplemented error.
func (r *MockGitRepo) GetBlob(ctx context.Context, project, name, revision, path string) (*TreeEntry, error) {
	return nil, errors.New("git operations not yet implemented")
}