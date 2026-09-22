import sys
from utils.audio_processor import process_input

url = "https://www.youtube.com/watch?v=r0u83Ss7QRc"
try:
    process_input(url)
except Exception as e:
    import traceback
    traceback.print_exc()
