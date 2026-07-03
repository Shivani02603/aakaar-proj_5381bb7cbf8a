import pytest

def test_fr_001_register_then_login_returns_jwt(client):
    # Register a new user
    register_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    register_response = client.post("/api/auth/register", json=register_data)
    assert register_response.status_code == 201

    # Login with the registered user
    login_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    login_response = client.post("/api/auth/login", json=login_data)
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
    assert login_response.json()["token_type"] == "bearer"

def test_fr_002_create_read_update_delete_todos(client, auth_headers):
    # Create a new todo
    create_data = {
        "title": "Test Todo",
        "description": "This is a test todo",
        "due_date": "2023-12-31",
        "completed": False
    }
    create_response = client.post("/api/todos", json=create_data, headers=auth_headers)
    assert create_response.status_code == 201
    created_todo = create_response.json()
    assert created_todo["title"] == create_data["title"]
    assert created_todo["description"] == create_data["description"]
    assert created_todo["due_date"] == create_data["due_date"]
    assert created_todo["completed"] == create_data["completed"]

    # Read the created todo
    todo_id = created_todo["id"]
    read_response = client.get(f"/api/todos/{todo_id}", headers=auth_headers)
    assert read_response.status_code == 200
    read_todo = read_response.json()
    assert read_todo == created_todo

    # Update the todo
    update_data = {
        "title": "Updated Test Todo",
        "description": "This is an updated test todo",
        "due_date": "2024-01-01",
        "completed": True
    }
    update_response = client.put(f"/api/todos/{todo_id}", json=update_data, headers=auth_headers)
    assert update_response.status_code == 200
    updated_todo = update_response.json()
    assert updated_todo["title"] == update_data["title"]
    assert updated_todo["description"] == update_data["description"]
    assert updated_todo["due_date"] == update_data["due_date"]
    assert updated_todo["completed"] == update_data["completed"]

    # Delete the todo
    delete_response = client.delete(f"/api/todos/{todo_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    # Verify the todo is deleted
    get_deleted_response = client.get(f"/api/todos/{todo_id}", headers=auth_headers)
    assert get_deleted_response.status_code == 404