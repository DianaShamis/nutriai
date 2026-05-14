from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from api.routes.health import router as health_router
from api.routes.db_check import router as db_check_router
from api.routes.auth import router as auth_router
from core.resources import (
    create_redis_client,
    close_redis_client,
    create_http_session,
    close_http_session,
)
from api.routes.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware

def create_app() -> FastAPI:
    app = FastAPI(title="NutriAI API",
        description="Backend для персонализированных планов питания и рекомендаций на основе искусственного интеллекта.",
        docs_url="/docs",
        redoc_url="/redoc",)
    
    # app.add_middleware(
    #     CORSMiddleware,
    #     allow_origins=settings.CORS_ORIGINS,
    #     allow_credentials=True,
    #     allow_methods=["*"],
    #     allow_headers=["*"],
    # )

    app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(db_check_router)
    app.include_router(auth_router)
    app.include_router(users_router)

    @app.on_event("startup")
    async def on_startup() -> None:
        app.state.redis = await create_redis_client(str(settings.REDIS_URL))
        app.state.http_session = create_http_session()

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        await close_redis_client(getattr(app.state, "redis", None))
        await close_http_session(getattr(app.state, "http_session", None))

    return app

app = create_app()
