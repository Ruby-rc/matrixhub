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
	"time"
)

// Model represents an AI model in the system.
type Model struct {
	ID             int64     `json:"id" db:"id"`
	Name           string    `json:"name" db:"name"`
	ProjectID      int       `json:"projectId" db:"project_id"`
	ProjectName    string    `json:"projectName" db:"project_name" gorm:"<-:false"` // Read-only, not writable
	Size           int64     `json:"size" db:"size"`
	DefaultBranch  string    `json:"defaultBranch" db:"default_branch"`
	ParameterCount int64     `json:"parameterCount" db:"parameter_count"`
	ReadmeContent  string    `json:"readmeContent" db:"readme_content"`
	IsPopular      bool      `json:"isPopular" db:"is_popular"`
	Labels         []Label   `json:"labels" db:"-" gorm:"-"`
	CreatedAt      time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt      time.Time `json:"updatedAt" db:"updated_at"`
}

// Label represents a category label for models/datasets.
type Label struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Category  string    `json:"category" db:"category"`
	Scope     string    `json:"scope" db:"scope"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
}

// Filter defines query parameters for listing models.
type Filter struct {
	Project  string   // filter by project name
	Label    []string // filter by labels
	Search   string   // project name or model name, prioritize project name matching (supports fuzzy search).
	Sort     string
	Page     int32
	PageSize int32
}

// IModelRepo defines the repository interface for model operations.
type IModelRepo interface {
	// Create creates a new model in the database.
	Create(ctx context.Context, m *Model) (*Model, error)

	// GetByProjectAndName retrieves a model by its project and name.
	GetByProjectAndName(ctx context.Context, project, name string) (*Model, error)

	// List retrieves a list of models based on the provided filter, along with the total count.
	List(ctx context.Context, filter *Filter) ([]*Model, int64, error)

	// Delete removes a model from the database by its project and name.
	Delete(ctx context.Context, project, name string) error
}

// Git-related types for model version control

// Revision represents a Git reference (branch or tag).
type Revision struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
}

// Revisions contains branches and tags.
type Revisions struct {
	Branches []*Revision `json:"branches"`
	Tags     []*Revision `json:"tags"`
}

// Commit represents a Git commit.
type Commit struct {
	ID             string    `json:"id"`
	Message        string    `json:"message"`
	AuthorName     string    `json:"authorName"`
	AuthorEmail    string    `json:"authorEmail"`
	AuthorDate     time.Time `json:"authorDate"`
	CommitterName  string    `json:"committerName"`
	CommitterEmail string    `json:"committerEmail"`
	Diffs          []*Diff   `json:"diffs"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// Diff represents a file change in a commit.
type Diff struct {
	Diff    string `json:"diff"`
	Deleted bool   `json:"deleted"`
	NewPath string `json:"newPath"`
	OldPath string `json:"oldPath"`
}

// FileType represents the type of file in the Git tree.
type FileType int

const (
	FileTypeDir  FileType = 0
	FileTypeFile FileType = 1
)

// TreeEntry represents a file or directory in the Git tree.
type TreeEntry struct {
	Name    string   `json:"name"`
	Type    FileType `json:"type"`
	Size    int64    `json:"size"`
	Path    string   `json:"path"`
	Hash    string   `json:"hash"`
	IsLFS   bool     `json:"isLFS"`
	Content string   `json:"content,omitempty"` // File content for small files
	Commit  *Commit  `json:"commit,omitempty"`
}

// IGitRepo defines the repository interface for Git operations on models.
type IGitRepo interface {
	// CreateRepository initializes a Git repository.
	CreateRepository(ctx context.Context, project, name string) error

	// DeleteRepository removes the Git repository.
	DeleteRepository(ctx context.Context, project, name string) error

	// ListRevisions returns all branches and tags for a model.
	ListRevisions(ctx context.Context, project, name string) (*Revisions, error)

	// ListCommits returns the commit history for a model.
	ListCommits(ctx context.Context, project, name, revision string, page, pageSize int) ([]*Commit, int64, error)

	// GetCommit returns a specific commit by ID.
	GetCommit(ctx context.Context, project, name, commitID string) (*Commit, error)

	// GetTree returns the file tree at a specific revision and path.
	GetTree(ctx context.Context, project, name, revision, path string) ([]*TreeEntry, error)

	// GetBlob returns the content of a file at a specific revision.
	GetBlob(ctx context.Context, project, name, revision, path string) (*TreeEntry, error)
}

// ILabelRepo defines the repository interface for label operations.
type ILabelRepo interface {
	ListByCategoryAndScope(ctx context.Context, category, scope string) ([]*Label, error)
	GetByModelID(ctx context.Context, modelID int64) ([]*Label, error)
}
