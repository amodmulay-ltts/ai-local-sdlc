.PHONY: help install install-dev clean test lint format type-check db-up db-down migrate migrate-create run docs

help:
	@echo "AI SDLC Factory - Development Commands"
	@echo ""
	@echo "install              Install core dependencies"
	@echo "install-dev          Install development dependencies"
	@echo "clean                Clean build artifacts and cache"
	@echo "test                 Run tests with coverage"
	@echo "test-integration     Run integration tests only"
	@echo "lint                 Run ruff linter"
	@echo "format               Format code with black"
	@echo "type-check           Run mypy type checking"
	@echo "pre-commit-install   Install pre-commit hooks"
	@echo "db-up                Start PostgreSQL container"
	@echo "db-down              Stop PostgreSQL container"
	@echo "migrate              Run database migrations"
	@echo "migrate-create       Create a new migration"
	@echo "run                  Start the API server"
	@echo "dev                  Start the API in development mode"

install:
	pip install -e .

install-dev:
	pip install -e ".[dev]"

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +

test:
	pytest --cov=src --cov-report=html -v

test-integration:
	pytest -m integration -v

lint:
	ruff check src tests

format:
	ruff check src tests --fix
	black src tests

type-check:
	mypy src --ignore-missing-imports

pre-commit-install:
	pre-commit install

db-up:
	docker-compose up -d postgres redis

db-down:
	docker-compose down

db-logs:
	docker-compose logs -f postgres

migrate:
	alembic upgrade head

migrate-create:
	@read -p "Enter migration message: " msg; \
	alembic revision --autogenerate -m "$$msg"

migrate-downgrade:
	alembic downgrade -1

run:
	python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000

dev:
	python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

docs:
	echo "OpenAPI docs available at http://localhost:8000/docs"
