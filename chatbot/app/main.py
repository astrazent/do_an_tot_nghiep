from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .router import conversation, document, datasource

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(conversation.router)
app.include_router(document.router)
app.include_router(datasource.router)