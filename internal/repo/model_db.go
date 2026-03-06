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

package repo

import (
	"context"
	"fmt"

	"gorm.io/gorm"

	"github.com/matrixhub-ai/matrixhub/internal/domain/model"
)

type modelDB struct {
	db *gorm.DB
}

// NewModelDB creates a new ModelRepo instance
func NewModelDB(db *gorm.DB) model.IModelRepo {
	return &modelDB{db: db}
}

// List retrieves models with filtering and pagination
func (m *modelDB) List(ctx context.Context, filter *model.Filter) ([]*model.Model, int64, error) {
	// Set defaults
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.PageSize <= 0 {
		filter.PageSize = 20
	}

	// Build base query with JOIN to projects
	query := m.db.WithContext(ctx).
		Table("models m").
		Select(`m.id, m.name, m.project_id, m.size, m.parameter_count,
				m.readme_content, m.is_featured,
				m.created_at, m.updated_at,
				p.name as project_name`).
		Joins("INNER JOIN projects p ON m.project_id = p.id")

	// Apply filters
	if filter.Project != "" {
		query = query.Where("p.name = ?", filter.Project)
	}

	if filter.Search != "" {
		pattern := "%" + filter.Search + "%"
		query = query.Where("p.name LIKE ? OR m.name LIKE ?", pattern, pattern)
	}

	if len(filter.Label) > 0 {
		for _, label := range filter.Label {
			query = query.Where(`EXISTS (
				SELECT 1 FROM models_labels ml
				INNER JOIN labels l ON ml.label_id = l.id
				WHERE ml.model_id = m.id AND l.name = ?
			)`, label)
		}
	}

	// Get total count
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count models: %w", err)
	}

	// Apply sorting
	orderBy := "m.updated_at DESC"
	if filter.Sort == "asc" || filter.Sort == "updated_at_asc" {
		orderBy = "m.updated_at ASC"
	}

	// Apply pagination
	offset := (filter.Page - 1) * filter.PageSize
	query = query.Order(orderBy).Limit(int(filter.PageSize)).Offset(int(offset))

	// Execute query
	var models []*model.Model
	if err := query.Find(&models).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to list models: %w", err)
	}

	// Fetch labels for each model
	for _, mdl := range models {
		labels, err := m.getLabels(ctx, mdl.ID)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to fetch labels for model %d: %w", mdl.ID, err)
		}
		mdl.Labels = labels
	}

	return models, total, nil
}

// getLabels fetches labels for a specific model
func (m *modelDB) getLabels(ctx context.Context, modelID int64) ([]model.Label, error) {
	var labels []model.Label
	err := m.db.WithContext(ctx).
		Table("labels l").
		Joins("INNER JOIN models_labels ml ON l.id = ml.label_id").
		Where("ml.model_id = ?", modelID).
		Find(&labels).Error
	return labels, err
}

// Create creates a new model (placeholder - not implemented for this task)
func (m *modelDB) Create(ctx context.Context, mod *model.Model) (*model.Model, error) {
	return nil, fmt.Errorf("not implemented")
}

// GetByProjectAndName retrieves a model by project and name (placeholder)
func (m *modelDB) GetByProjectAndName(ctx context.Context, project, name string) (*model.Model, error) {
	return nil, fmt.Errorf("not implemented")
}

// Delete removes a model (placeholder)
func (m *modelDB) Delete(ctx context.Context, project, name string) error {
	return fmt.Errorf("not implemented")
}