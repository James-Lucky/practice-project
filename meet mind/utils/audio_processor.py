import yt_dlp
from pydub import AudioSegment
import os
import subprocess
import imageio_ffmpeg

DOWNLOAD_DIR = 'downloades'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Set global ffmpeg path for pydub and subprocess
ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
AudioSegment.converter = ffmpeg_path

def download_youtube_audio(url: str) -> str:
    """Download audio from YouTube and convert to WAV with deterministic filename."""
    import glob

    ydl_info_opts = {
        "quiet": True,
        "extractor_args": {"youtube": {"player_client": ["android", "web"]}},
    }
    with yt_dlp.YoutubeDL(ydl_info_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        video_id = info.get("id", "audio")

    target_wav = os.path.join(DOWNLOAD_DIR, f"{video_id}.wav")
    if os.path.exists(target_wav) and os.path.getsize(target_wav) > 1000:
        print(f"Using already cached audio: {target_wav}")
        return target_wav

    raw_template = os.path.join(DOWNLOAD_DIR, f"temp_{video_id}.%(ext)s")
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": raw_template,
        "quiet": True,
        "extractor_args": {"youtube": {"player_client": ["android", "web"]}},
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    raw_candidates = glob.glob(os.path.join(DOWNLOAD_DIR, f"temp_{video_id}.*"))
    if not raw_candidates:
        raise FileNotFoundError(f"Failed to download audio for video {video_id}")

    raw_file = raw_candidates[0]
    try:
        subprocess.run(
            [ffmpeg_path, "-y", "-i", raw_file, "-vn", "-ac", "1", "-ar", "16000", target_wav],
            check=True,
            capture_output=True
        )
    finally:
        for f in raw_candidates:
            try:
                os.remove(f)
            except OSError:
                pass

    return target_wav


def convert_to_wav(input_path: str) -> str:
    """
    Convert any audio/video file to 16kHz mono WAV using ffmpeg directly.
    Does NOT require ffprobe, which avoids Windows FileNotFoundError.
    """
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    clean_base = "".join(c for c in base_name if c.isalnum() or c in ("-", "_")).strip() or "uploaded_media"
    output_path = os.path.join(DOWNLOAD_DIR, f"{clean_base}_converted.wav")

    cmd = [
        ffmpeg_path,
        "-y",
        "-i", input_path,
        "-vn",
        "-ac", "1",
        "-ar", "16000",
        output_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg conversion failed: {result.stderr}")

    return output_path


def chunk_audio(wav_path: str, chunk_minutes: int = 10) -> list:
    audio = AudioSegment.from_wav(wav_path)
    chunk_ms = chunk_minutes * 60 * 1000

    chunks = []
    for i, start in enumerate(range(0, len(audio), chunk_ms)):
        chunk = audio[start : start + chunk_ms]
        chunk_path = f"{wav_path}_chunk_{i}.wav"
        chunk.export(chunk_path, format="wav")
        chunks.append(chunk_path)

    if not chunks:
        chunks = [wav_path]

    return chunks


def process_input(source: str) -> list:
    if source.startswith("http://") or source.startswith("https://"):
        print("Detected YouTube URL. Downloading audio...")
        wav_path = download_youtube_audio(source)
    else:
        print("Detected local file. Converting to WAV...")
        wav_path = convert_to_wav(source)

    print(f"Chunking audio from: {wav_path} ...")
    chunks = chunk_audio(wav_path)
    print(f"Audio ready — {len(chunks)} chunk(s) created.")
    return chunks


