"""
Минимальный FastAPI-слой для вызовов iiko API.
Реальные ключи и URL — только через переменные окружения; не коммить секреты.

Запуск локально:
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8090
"""

from __future__ import annotations

import os
from typing import Any

import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Restaurant OS iiko adapter", version="0.1.0")

IIKO_BASE = os.getenv("IIKO_API_BASE", "https://api-ru.iiko.services/api/1")
IIKO_API_KEY = os.getenv("IIKO_API_KEY", "")


class MenuRequest(BaseModel):
    organizationId: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/menu")
def post_menu(payload: MenuRequest) -> dict[str, Any]:
    """
    Прокси к номенклатуре iiko. В проде: retry, таймауты, маппинг DTO, кэш.
    """
    if not IIKO_API_KEY:
        raise HTTPException(
            status_code=501,
            detail="IIKO_API_KEY не задан — адаптер в режиме заглушки",
        )

    url = f"{IIKO_BASE.rstrip('/')}/nomenclature"
    try:
        response = requests.post(
            url,
            json={"organizationId": payload.organizationId, "startRevision": 0},
            headers={"Authorization": IIKO_API_KEY},
            timeout=30,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    data = response.json()
    return transform_menu(data)


def transform_menu(iiko_data: dict[str, Any]) -> dict[str, Any]:
    """Нормализация под внутренний контракт (упрощённо)."""
    products = iiko_data.get("products") or []
    items: list[dict[str, Any]] = []
    for product in products:
        if not isinstance(product, dict):
            continue
        items.append(
            {
                "id": product.get("id"),
                "name": product.get("name"),
                "price": product.get("price", 0),
                "description": product.get("description", ""),
                "category": product.get("groupId"),
            }
        )
    return {"items": items}
