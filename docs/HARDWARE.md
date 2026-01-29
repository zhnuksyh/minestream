# Hardware Compatibility Guide

MineStream is optimized for **NVIDIA GPUs (CUDA)** by default, but it can run on other hardware with some adjustments.

## 1. AMD GPUs (Ryzen/Radeon)
AMD GPUs cannot use CUDA. Instead, they use **ROCm** (on Linux) or **DirectML** (on Windows).

### Linux (Recommended: ROCm)
**Important:** `flash-attn` is NVIDIA-only. Remove it from `requirements.txt`.

1.  **Uninstall current PyTorch:**
    ```bash
    pip uninstall torch torchaudio torchvision
    ```
2.  **Install ROCm PyTorch:**
    (Check [pytorch.org](https://pytorch.org/get-started/locally/) for the latest version compatible with your card)
    ```bash
    pip install torch torchaudio --index-url https://download.pytorch.org/whl/rocm6.0
    ```
3.  **Verify:**
    The app will detect `cuda` (ROCm mimics CUDA APIs) or you might need to force `device='hip'`.

### Windows (DirectML)
ROCm support on Windows is experimental. You might need to rely on CPU mode or use the [WSL2 subsystem](https://docs.microsoft.com/en-us/windows/wsl/install) to run Linux ROCm.

---

## 2. Running on CPU (Universal)
If you have no dedicated GPU, the app **automatically falls back to CPU**.
*   **Pros:** Works on any laptop (Intel/AMD/Apple Silicon).
*   **Cons:** Very slow (high latency). Voice generation might take 5-10 seconds instead of <1 second.

**Optimization for CPU:**
*   Ensure you have at least **16GB RAM** (8GB System + 8GB for Models).
*   In `app/core/config.py`, set `USE_GPU = False` to force CPU mode if auto-detection fails.

---

## 3. Apple Silicon (Mac M1/M2/M3)
Macs use **MPS** (Metal Performance Shaders) for acceleration.

1.  **Install PyTorch Nightly:**
    ```bash
    pip install --pre torch torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cpu
    ```
2.  **Code Adjustment:**
    Update `app/services/tts_service.py` to detect MPS:
    ```python
    device_str = "mps" if torch.backends.mps.is_available() else "cpu"
    ```

---

## Summary Table

| Hardware | Backend | Setup Required | Performance |
| :--- | :--- | :--- | :--- |
| **NVIDIA RTX 30/40** | CUDA | Default (Easy) | ⭐⭐⭐⭐⭐ (Real-time) |
| **AMD RX 6000/7000** | ROCm | Manual PyTorch Swap | ⭐⭐⭐⭐ (Near Native) |
| **Mac M1/M2/M3** | MPS | Code Tweak | ⭐⭐⭐ (Good) |
| **Intel/AMD CPU** | CPU | Default (Auto) | ⭐ (Slow) |
