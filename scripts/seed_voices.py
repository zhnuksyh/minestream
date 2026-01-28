
import asyncio
import sys
import os

# Add parent dir to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import init_db, SessionLocal, engine, Base
from app.models.voice import VoiceProfile

DEFAULT_VOICES = [
    {
        "name": "Epic Narrator",
        "tag": "Story",
        "prompt": "A deep, resonant, and epic male voice suitable for movie trailers and high-fantasy narration."
    },
    {
        "name": "Cyber System",
        "tag": "Sci-Fi",
        "prompt": "A crisp, cool, and slightly robotic female AI voice, speaking with precise articulation."
    },
    {
        "name": "Whispering Shadow",
        "tag": "Villain",
        "prompt": "A raspy, low, and menacing whisper, sounding like a dangerous antagonist in the shadows."
    }
]

async def seed():
    print("Resetting database...")
    # For SQLite, just drop the tables or file to force schema update
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    print("Seeding voices...")
    async with SessionLocal() as session:
        for v in DEFAULT_VOICES:
            profile = VoiceProfile(
                name=v["name"],
                tag=v["tag"],
                prompt=v["prompt"]
            )
            session.add(profile)
        await session.commit()
    
    print("Done! Added default voices.")

if __name__ == "__main__":
    asyncio.run(seed())
