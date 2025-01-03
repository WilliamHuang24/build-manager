from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select

from fastapi.middleware.cors import CORSMiddleware

class Build(SQLModel, table=True):
    id: str
    framework: str 
    passed: int
    failed: int 
    skipped: int
    hostname: str
    date: str
    
    # framework + id
    key: str = Field(index = True, primary_key = True)

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

origins=["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/builds/")
def create_build(build: Build, session: SessionDep) -> Build:
    session.add(build)
    session.commit()
    session.refresh(build)
    return build

@app.get("/builds/")
def read_builds(
    session: SessionDep,
    limit: Annotated[int, Query(le=1000)] = 1000,
) -> list[Build]:
    builds = session.exec(select(Build).limit(limit)).all()
    return builds

