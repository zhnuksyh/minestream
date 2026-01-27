import time
import uuid
from sqlalchemy import Column, String, Float, Integer
from app.core.database import Base

class VoiceProfile(Base):
    __tablename__ = "voice_profiles"

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:8])
    name = Column(String, nullable=False)
    tag = Column(String, nullable=False)  # e.g., "Gaming", "Narrator"
    file_path = Column(String, nullable=False) # Path to the stored embedding/wav
    created_at = Column(Float, default=time.time)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tag": self.tag,
            "created_at": self.created_at
        }
