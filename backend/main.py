from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import chat, agents, knowledge, tools

Base.metadata.create_all(bind=engine)

app = FastAPI(title="思安新能源 AI Agent 平台", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(agents.router)
app.include_router(knowledge.router)
app.include_router(tools.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
