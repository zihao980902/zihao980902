// ========== 请替换成你的Sora2 API信息 ==========
const API_KEY = "sk-WgcqHcfffonLT8rIarHPYt86hLXEsnhkjShi9t262X4F4Qjs"; // 替换成 sk-xxx 格式的密钥
const BASE_URL = "https://yunwu.ai/v1"; // 替换成商家提供的接口地址
// ==============================================

// DOM元素获取
const generateBtn = document.getElementById('generateBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const progressText = document.getElementById('progressText');
const resultContainer = document.getElementById('resultContainer');
const successResult = document.getElementById('successResult');
const errorResult = document.getElementById('errorResult');
const emptyResult = document.getElementById('emptyResult');
const videoLink = document.getElementById('videoLink');
const errorText = document.getElementById('errorText');

// 进度模拟函数（可视化进度）
function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    progressText.textContent = text;
}

// 显示结果函数
function showResult(type, data = {}) {
    // 隐藏所有状态
    emptyResult.classList.add('hidden');
    progressContainer.classList.add('hidden');
    successResult.classList.add('hidden');
    errorResult.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // 显示对应状态
    if (type === 'loading') {
        progressContainer.classList.remove('hidden');
    } else if (type === 'success') {
        successResult.classList.remove('hidden');
        videoLink.href = data.videoUrl;
        videoLink.textContent = `📥 下载视频（${data.duration}秒/${data.resolution}）`;
    } else if (type === 'error') {
        errorResult.classList.remove('hidden');
        errorText.textContent = data.message || '生成失败，请稍后重试';
    }
}

// 重置结果区域
function resetResult() {
    resultContainer.classList.add('hidden');
    emptyResult.classList.remove('hidden');
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fas fa-rocket"></i> 生成AI视频';
    updateProgress(0, '初始化请求...');
}

// 生成视频核心函数
async function generateVideo() {
    // 获取输入参数
    const prompt = document.getElementById('prompt').value.trim();
    const duration = document.getElementById('duration').value;
    const resolution = document.getElementById('resolution').value;
    const aspect_ratio = document.getElementById('aspect_ratio').value;
    const style = document.getElementById('style').value;

    // 验证必填项
    if (!prompt) {
        showResult('error', { message: '❌ 请输入视频描述，这是必填项！' });
        return;
    }

    // 按钮禁用，显示加载状态
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
    showResult('loading');
    
    try {
        // 步骤1：初始化进度
        updateProgress(10, '正在验证API密钥...');
        await new Promise(resolve => setTimeout(resolve, 800));

        // 步骤2：构建请求参数
        updateProgress(20, '正在构建视频参数...');
        const requestParams = {
            model: "sora-2",
            prompt: `${prompt}，风格：${style}`,
            duration: parseInt(duration),
            resolution: resolution,
            aspect_ratio: aspect_ratio
        };
        await new Promise(resolve => setTimeout(resolve, 800));

        // 步骤3：发送API请求
        updateProgress(30, '正在发送生成请求...');
        const response = await fetch(`${BASE_URL}/videos/generations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestParams)
        });
        await new Promise(resolve => setTimeout(resolve, 800));

        // 步骤4：处理响应
        updateProgress(60, '正在处理视频数据...');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API请求失败：${response.status}`);
        }

        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤5：完成生成
        updateProgress(100, '视频生成完成！');
        await new Promise(resolve => setTimeout(resolve, 500));

        // 显示成功结果
        showResult('success', {
            videoUrl: data.video_url || data.data?.video_url,
            duration: duration,
            resolution: resolution
        });

    } catch (error) {
        // 显示错误信息
        updateProgress(0, '生成失败');
        showResult('error', { message: `❌ ${error.message}` });
        console.error('生成失败:', error);
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-rocket"></i> 生成AI视频';
    }
}
