import streamlit as st
import time
import os
import imageio_ffmpeg

# Forcefully add bundled FFmpeg to the system PATH for this process
# This ensures that tools like openai-whisper that call subprocess.run(["ffmpeg"]) don't crash
os.environ["PATH"] += os.pathsep + os.path.dirname(imageio_ffmpeg.get_ffmpeg_exe())

from dotenv import load_dotenv
from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import extract_action_items, extract_key_decisions, extract_questions
from core.rag_engine import build_rag_chain, ask_question

load_dotenv()

st.set_page_config(
    page_title="Meet Mind AI Video Assistant",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

/* Beautiful gradient for the main hero title */
.hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0;
    background: linear-gradient(135deg, #ffffff 0%, #9f67ff 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    padding-bottom: 0.5rem;
}
.hero-sub {
    font-family: monospace;
    font-size: 1rem;
    color: #7070a0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 2rem;
}
</style>
""", unsafe_allow_html=True)

# ─── Session State Init ───
if "result" not in st.session_state:
    st.session_state.result = None
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# ─── Sidebar ───
with st.sidebar:
    st.markdown("## 🎬 Meet Mind AI\n**Meeting Intelligence**")
    st.markdown("---")
    
    input_type = st.radio("Source Type", ["YouTube URL", "Upload File"], horizontal=True)
    if input_type == "YouTube URL":
        source = st.text_input("YouTube URL", placeholder="https://youtube.com/...")
    else:
        uploaded_file = st.file_uploader("Upload Audio/Video", type=["mp4", "wav", "mp3", "m4a", "webm", "avi", "mov"])
        source = None
        if uploaded_file is not None:
            os.makedirs("downloades", exist_ok=True)
            clean_name = "".join(c for c in uploaded_file.name if c.isalnum() or c in ("-", "_", ".")).strip() or "uploaded_file.mp4"
            source = os.path.join("downloades", clean_name)
            with open(source, "wb") as f:
                f.write(uploaded_file.getbuffer())
            st.caption(f"📁 Ready: {uploaded_file.name}")
    language = st.selectbox("Language", ["english", "hinglish"], index=0)
    run_btn = st.button("⚡ Analyse Video", use_container_width=True, type="primary")
    
    if st.session_state.chat_history:
        st.markdown("---")
        if st.button("🗑️ Clear Chat", use_container_width=True):
            st.session_state.chat_history = []
            st.rerun()

# ─── Main Area ───
st.markdown('<div class="hero-title">AI Video Assistant</div>', unsafe_allow_html=True)
st.markdown('<div class="hero-sub">Transcribe · Summarise · Chat with your meetings</div>', unsafe_allow_html=True)

# ── Run Pipeline ───
if run_btn:
    if not source or not str(source).strip():
        st.error("Please enter a YouTube URL or upload a file.")
    else:
        st.session_state.result = None
        st.session_state.chat_history = []

        try:
            with st.status("Analyzing Video...", expanded=True) as status:
                st.write("🔊 Extracting Audio...")
                chunks = process_input(source)
                
                st.write("📝 Transcribing...")
                transcript = transcribe_all(chunks, language)
                
                st.write("🏷️ Generating Title & Summary...")
                title = generate_title(transcript)
                summary = summarize(transcript)
                
                st.write("🔍 Extracting Insights...")
                action_items = extract_action_items(transcript)
                decisions = extract_key_decisions(transcript)
                questions = extract_questions(transcript)
                
                st.write("🧠 Building RAG Chat Engine...")
                rag_chain = build_rag_chain(transcript)
                
                status.update(label="Analysis Complete! ✅", state="complete", expanded=False)

            st.session_state.result = {
                "title": title,
                "transcript": transcript,
                "summary": summary,
                "action_items": action_items,
                "key_decisions": decisions,
                "open_questions": questions,
                "rag_chain": rag_chain,
            }
            st.rerun()

        except Exception as e:
            st.error(f"❌ Error: {e}")

# ── Results ───
if st.session_state.result:
    r = st.session_state.result

    st.markdown(f"### 📌 {r['title']}")
    
    col1, col2 = st.columns([3, 2], gap="medium")
    
    with col1:
        with st.container(border=True):
            st.subheader("📋 Summary")
            st.markdown(r['summary'])
            
    with col2:
        with st.expander("📝 Full Transcript", expanded=False):
            st.text(r['transcript'])

    c1, c2, c3 = st.columns(3, gap="medium")
    
    with c1:
        with st.container(border=True):
            st.subheader("✅ Action Items")
            st.markdown(r['action_items'])
            
    with c2:
        with st.container(border=True):
            st.subheader("🔑 Key Decisions")
            st.markdown(r['key_decisions'])
            
    with c3:
        with st.container(border=True):
            st.subheader("❓ Open Questions")
            st.markdown(r['open_questions'])

    st.markdown("---")
    
    # ── RAG Chat ───
    st.subheader("💬 Chat with your Meeting")
    
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            
    if prompt := st.chat_input("Ask anything about your meeting transcript..."):
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
            
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                answer = ask_question(r["rag_chain"], prompt)
                st.markdown(answer)
        st.session_state.chat_history.append({"role": "assistant", "content": answer})

else:
    st.info("👈 Paste a YouTube URL or local file path in the sidebar and hit **Analyse** to get started.")