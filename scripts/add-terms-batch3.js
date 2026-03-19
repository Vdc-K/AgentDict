#!/usr/bin/env node
// 批量新增词条 - 第3批：NLP + 计算机视觉 + Agent扩充 + 商业与产品 + 开源与社区
const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '../src/dictionary/terms.json');
const existing = JSON.parse(fs.readFileSync(termsPath, 'utf8'));

const newTerms = {

  // ========== NLP ==========
  'tokenization': {
    term: 'Tokenization',
    aliases: ['分词', '文本分词', 'tokenize'],
    category: 'NLP',
    levels: {
      beginner: '把文字切成更小单元的过程，比如把"ChatGPT很厉害"切成["Chat", "G", "PT", "很", "厉", "害"]，AI 处理的不是文字本身，而是这些小片段。',
      intermediate: '将文本分割为模型可处理的最小单元（Token）的过程。现代 LLM 使用子词分词（如 BPE），英文单词可能对应 1 个 token，中文每个汉字通常对应 1-2 个 token。',
      advanced: 'Tokenization 的主要算法：BPE（Byte-Pair Encoding，GPT 系列）、WordPiece（BERT）、SentencePiece（T5/Llama）。分词粒度影响词表大小和 OOV（Out-of-Vocabulary）率之间的权衡。Unicode 字节级别的 BBPE 彻底解决了多语言 OOV 问题。'
    },
    relatedTerms: ['tokenizer', 'bpe', 'token', 'llm'],
    contexts: ['nlp', 'preprocessing'],
    emoji: '✂️',
    difficulty: 'medium'
  },

  'bpe': {
    term: 'BPE',
    aliases: ['Byte-Pair Encoding', '字节对编码', 'Byte Pair Encoding'],
    category: 'NLP',
    levels: {
      beginner: '一种把文字切成小片段的算法，通过统计哪些字符组合最常见来决定怎么切，让 AI 能高效处理各种语言的文字。GPT 系列都用这种方式。',
      intermediate: '子词分词算法，通过合并频率最高的字符对来学习词表。从字符级别开始，迭代合并直到达到目标词表大小（如 50K）。能平衡词表大小和分词粒度。',
      advanced: 'BPE 原始是数据压缩算法，被 Sennrich 等人引入 NMT。训练过程：初始化为字符词表 → 统计相邻 token 对频率 → 合并最高频对 → 重复。推理时贪心匹配最长 token。GPT-4 的词表达 100K，Llama 3 达 128K，中文覆盖率因此大幅提升。'
    },
    relatedTerms: ['tokenization', 'tokenizer', 'token', 'vocabulary'],
    contexts: ['nlp', 'tokenization'],
    emoji: '🔤',
    difficulty: 'high'
  },

  'sentiment-analysis': {
    term: 'Sentiment Analysis',
    aliases: ['情感分析', '情绪分析', 'opinion mining'],
    category: 'NLP',
    levels: {
      beginner: '让 AI 判断一段文字是正面还是负面情绪的技术，比如分析商品评论是好评还是差评，是用户研究和舆情监控的常用工具。',
      intermediate: '自然语言处理任务，自动识别文本中表达的情感倾向（正面/负面/中性）或情绪类别（喜悦/愤怒/悲伤等）。广泛用于社交媒体监控、客服分析、品牌舆情。',
      advanced: '情感分析从粗粒度（文档级）到细粒度（方面级，Aspect-Based SA）不断发展。LLM 时代，few-shot 提示可直接完成复杂情感分析，甚至提取情感原因和目标实体，无需专门训练模型。'
    },
    relatedTerms: ['text-classification', 'nlp', 'llm'],
    contexts: ['nlp', 'analysis'],
    emoji: '😊',
    difficulty: 'medium'
  },

  'ner': {
    term: 'NER',
    aliases: ['Named Entity Recognition', '命名实体识别', '实体识别'],
    category: 'NLP',
    levels: {
      beginner: '让 AI 从文字中找出"人名、地名、公司名"等具体事物的技术，比如从新闻里自动识别出"马云"是人名、"阿里巴巴"是公司名。',
      intermediate: '序列标注任务，从文本中识别并分类命名实体（人名/地名/组织机构/时间/货币等）。是信息提取、知识图谱构建的基础组件，BERT 类模型在这类任务上表现很好。',
      advanced: 'NER 的标注格式：BIO/BIOES（B=Begin, I=Inside, O=Outside，标记实体边界）。细粒度 NER（Fine-grained NER）可识别数百种实体类型。LLM 时代，通过 structured output 提示即可完成 NER，无需专门训练序列标注模型。'
    },
    relatedTerms: ['nlp', 'text-classification', 'knowledge-graph'],
    contexts: ['nlp', 'information-extraction'],
    emoji: '🏷️',
    difficulty: 'medium'
  },

  'text-classification': {
    term: 'Text Classification',
    aliases: ['文本分类', '文本分类任务'],
    category: 'NLP',
    levels: {
      beginner: '让 AI 给文本打上类别标签的任务，比如把邮件分类为"垃圾邮件/正常邮件"，把新闻分类为"体育/财经/科技"等。',
      intermediate: 'NLP 的基础任务，将输入文本分配到预定义的类别中。包括二分类（垃圾邮件过滤）、多分类（新闻分类）、多标签分类（文章可以同时属于多个类别）。',
      advanced: '传统方法（TF-IDF + SVM）在小数据上仍有竞争力。BERT 类模型通过 [CLS] token 表示做分类头，在大多数基准上达到 SOTA。现代 LLM 直接 zero-shot 分类，无需标注数据，但延迟较高。'
    },
    relatedTerms: ['nlp', 'sentiment-analysis', 'fine-tuning', 'bert'],
    contexts: ['nlp', 'classification'],
    emoji: '📂',
    difficulty: 'medium'
  },

  'machine-translation': {
    term: 'Machine Translation',
    aliases: ['机器翻译', 'MT', 'Neural Machine Translation'],
    category: 'NLP',
    levels: {
      beginner: 'AI 自动把一种语言翻译成另一种语言的技术，Google 翻译、DeepL 都是这个。现在的 LLM 翻译质量已经很高，对常见语言对几乎可以商用。',
      intermediate: '利用 AI 模型自动翻译文本。从早期的统计机器翻译（SMT）发展到神经机器翻译（NMT，Seq2Seq + Attention），现在 LLM 的翻译能力已全面超越专用翻译模型（对资源丰富的语言对）。',
      advanced: '神经机器翻译的里程碑：Seq2Seq + Attention（2015）→ Transformer（2017）→ 大规模预训练（mBART/mT5）→ LLM（GPT/Claude）。BLEU 分数是传统评估指标，但与人类判断相关性有限，现在越来越多用 COMET 等模型评估指标。'
    },
    relatedTerms: ['nlp', 'transformer', 'multilingual-model'],
    contexts: ['nlp', 'translation'],
    emoji: '🌍',
    difficulty: 'medium'
  },

  'text-generation': {
    term: 'Text Generation',
    aliases: ['文本生成', '自然语言生成', 'NLG'],
    category: 'NLP',
    levels: {
      beginner: 'AI 自动写文字的能力，包括写文章、写代码、回答问题、生成邮件等。ChatGPT 的核心能力就是文本生成，本质上是预测"下一个词最可能是什么"。',
      intermediate: '自然语言生成（NLG），让模型生成流畅、连贯的文本。LLM 通过自回归（Autoregressive）方式逐 token 生成，每次预测下一个 token 的概率分布后采样。',
      advanced: '文本生成的关键技术：Greedy Search（贪心，质量低）、Beam Search（束搜索，质量高但多样性低）、Nucleus Sampling（top-p，平衡质量和多样性）。Speculative Decoding 通过小模型草稿+大模型验证大幅提升吞吐量。'
    },
    relatedTerms: ['llm', 'token', 'temperature', 'top-p'],
    contexts: ['nlp', 'generation'],
    emoji: '✍️',
    difficulty: 'medium'
  },

  'summarization': {
    term: 'Summarization',
    aliases: ['文本摘要', '摘要生成', 'text summarization'],
    category: 'NLP',
    levels: {
      beginner: '让 AI 把长文章压缩成短摘要的技术，帮你快速了解文章核心内容，不用从头读到尾。Kimi 和 Claude 都特别擅长处理长文档摘要。',
      intermediate: 'NLP 任务，将长文档压缩为简短摘要。分为抽取式（Extractive，直接提取原文句子）和生成式（Abstractive，重新生成表述）两类。LLM 擅长生成式摘要。',
      advanced: '长文档摘要的挑战：超出上下文窗口时需要分段处理。策略：MapReduce（分段摘要再合并）、Refine（迭代精化）、HierarchicalSummarization（层级摘要）。ROUGE 分数是传统评估指标，衡量与参考摘要的 n-gram 重叠。'
    },
    relatedTerms: ['llm', 'rag', 'context-window', 'context-compression'],
    contexts: ['nlp', 'document-processing'],
    emoji: '📋',
    difficulty: 'medium'
  },

  'question-answering': {
    term: 'Question Answering',
    aliases: ['问答', 'QA', '智能问答'],
    category: 'NLP',
    levels: {
      beginner: '让 AI 回答问题的能力，包括从文档中找答案（阅读理解）和直接回答常识问题（开放域问答），是 ChatGPT 和企业知识库问答的核心功能。',
      intermediate: 'NLP 任务，分为：①抽取式 QA（从给定段落中抽取答案，如 SQuAD）；②生成式 QA（自由生成答案）；③开放域 QA（结合检索和生成，RAG 的核心应用场景）。',
      advanced: 'RAG 是当前最主流的 QA 架构：将问题向量化检索相关文档，拼接为上下文输入 LLM 生成答案。评估指标：EM（完全匹配）、F1（词级别匹配）用于抽取式，RAGAS 框架用于 RAG 系统的端到端评估。'
    },
    relatedTerms: ['rag', 'llm', 'nlp', 'knowledge-base'],
    contexts: ['nlp', 'qa'],
    emoji: '❓',
    difficulty: 'medium'
  },

  'text-to-speech': {
    term: 'Text-to-Speech',
    aliases: ['TTS', '语音合成', '文字转语音'],
    category: 'NLP',
    levels: {
      beginner: '把文字转成语音的技术，手机里的朗读功能、有声书、语音助手的回应都用到它，现在的 AI TTS 已经非常自然，很难分辨是真人还是机器。',
      intermediate: '文本转语音技术，将文字自动合成为自然语音。现代 TTS 模型（ElevenLabs、Edge TTS）基于 Diffusion 或自回归 Transformer，支持多语言、多音色，情感表达自然。',
      advanced: 'TTS 模型架构演进：参数化声码器（Vocoder，如 WaveNet）→ 端到端（Tacotron + WaveNet）→ 基于流的模型（Glow-TTS）→ Diffusion 模型（Grad-TTS）→ 语言模型风格（VALL-E）。零样本语音克隆（Voice Cloning）通过说话人嵌入实现，1 分钟语音即可克隆音色。'
    },
    relatedTerms: ['speech-to-text', 'elevenlabs', 'suno', 'multimodal'],
    contexts: ['nlp', 'voice'],
    emoji: '🔊',
    difficulty: 'medium'
  },

  'speech-to-text': {
    term: 'Speech-to-Text',
    aliases: ['STT', 'ASR', '语音识别', '自动语音识别', 'Automatic Speech Recognition'],
    category: 'NLP',
    levels: {
      beginner: '把语音转成文字的技术，就是手机语音输入、会议记录、字幕自动生成背后的技术。OpenAI 的 Whisper 是这个领域最好的开源模型之一。',
      intermediate: '自动语音识别（ASR），将音频中的语音转换为文本。Whisper（OpenAI）是目前最广泛使用的开源 ASR 模型，支持 99 种语言，在嘈杂环境和多语言场景下鲁棒性强。',
      advanced: 'ASR 的评估指标是词错误率（WER）。Whisper 使用 Encoder-Decoder Transformer 架构，将音频 Mel 频谱图作为输入，通过多任务训练同时学习转写、翻译、语言检测。端到端 ASR 已全面取代传统的 AM+LM+发音词典三段式系统。'
    },
    relatedTerms: ['text-to-speech', 'whisper', 'multimodal', 'elevenlabs'],
    contexts: ['nlp', 'voice'],
    emoji: '🎙️',
    difficulty: 'medium'
  },

  'ocr': {
    term: 'OCR',
    aliases: ['Optical Character Recognition', '光学字符识别', '文字识别'],
    category: 'NLP',
    levels: {
      beginner: '从图片里识别文字的技术，比如拍一张发票照片，AI 自动把上面的数字和文字提取出来变成可编辑的文本，不用手动输入。',
      intermediate: '光学字符识别，从图像（扫描文档/拍照/截图）中提取文本内容。传统方案基于图像处理+CNN，现代方案用 Vision Transformer（如 TrOCR）或多模态 LLM（可直接理解图片中的文字）。',
      advanced: 'OCR 的挑战：手写识别、复杂版式（多栏/表格/公式）、弱光/模糊图像。现代 VLM（如 Claude、GPT-4V）已集成 OCR 能力，直接理解文档图像，无需单独调用 OCR 组件。Document Intelligence（Azure）等服务还能提取文档结构信息。'
    },
    relatedTerms: ['computer-vision', 'multimodal', 'document-processing'],
    contexts: ['nlp', 'vision', 'document-processing'],
    emoji: '📷',
    difficulty: 'medium'
  },

  'multilingual-model': {
    term: 'Multilingual Model',
    aliases: ['多语言模型', '跨语言模型', 'multilingual LLM'],
    category: 'NLP',
    levels: {
      beginner: '能理解和生成多种语言的 AI 模型，不需要为每种语言单独训练一个模型，GPT-4 和 Claude 都是多语言模型，中英文都能很好地回答。',
      intermediate: '支持多种语言输入输出的语言模型。代表作：mBERT（104 语言）、XLM-R（100 语言）、mT5（101 语言），以及现代 LLM（GPT-4/Claude/Gemini 等）。多语言能力来自多语言预训练数据的覆盖。',
      advanced: '多语言模型的核心挑战：语言不均衡（英语数据多，低资源语言少）导致的"Curse of Multilinguality"，以及跨语言迁移（Cross-lingual Transfer）能力——在一种语言上微调能泛化到其他语言。研究发现 LLM 存在统一的"概念空间"支撑跨语言理解。'
    },
    relatedTerms: ['llm', 'bert', 'nlp', 'tokenization'],
    contexts: ['nlp', 'multilingual'],
    emoji: '🌍',
    difficulty: 'medium'
  },

  'language-model': {
    term: 'Language Model',
    aliases: ['语言模型', 'LM', '统计语言模型'],
    category: 'NLP',
    levels: {
      beginner: 'AI 通过学习大量文字后建立的对语言规律的理解，它知道什么词跟什么词常常出现在一起。大语言模型（LLM）就是特别大的语言模型。',
      intermediate: '对文本序列概率分布进行建模的模型，核心任务是预测下一个 token 的概率。从 n-gram 统计模型发展到 RNN，再到 Transformer 架构的现代 LLM，参数规模呈指数增长。',
      advanced: '语言模型的训练目标是最小化负对数似然（NLL），等价于最大化文本序列的联合概率。困惑度（Perplexity）是评估语言模型的标准指标。Scaling Law 表明，参数量和训练数据量的增加可预测地降低困惑度、提升下游任务性能。'
    },
    relatedTerms: ['llm', 'transformer', 'token', 'perplexity', 'scaling-law'],
    contexts: ['nlp', 'foundation'],
    emoji: '📖',
    difficulty: 'medium'
  },

  // ========== 计算机视觉 ==========
  'computer-vision': {
    term: 'Computer Vision',
    aliases: ['计算机视觉', 'CV'],
    category: '计算机视觉',
    levels: {
      beginner: '让电脑"看懂"图片和视频的技术领域，包括识别物体、人脸、文字等。手机解锁人脸识别、自动驾驶、医疗影像分析都用到计算机视觉。',
      intermediate: '让机器理解和分析图像/视频内容的 AI 领域。核心任务包括：图像分类、目标检测、图像分割、人脸识别、姿态估计等。从传统的手工特征（HOG/SIFT）发展到 CNN，再到 Vision Transformer。',
      advanced: '现代计算机视觉以 ViT（Vision Transformer）为核心架构，将图像分块（patch）后用 Transformer 处理。多模态大模型（如 GPT-4V/Claude Vision）通过对齐视觉和语言表示，实现了统一的视觉理解能力，正在取代专用视觉模型。'
    },
    relatedTerms: ['image-classification', 'object-detection', 'image-generation', 'vision-transformer'],
    contexts: ['vision', 'ai'],
    emoji: '👁️',
    difficulty: 'medium'
  },

  'image-classification': {
    term: 'Image Classification',
    aliases: ['图像分类', '图片分类'],
    category: '计算机视觉',
    levels: {
      beginner: '让 AI 判断一张图片是什么类别的任务，比如识别"这是猫还是狗"、"这是肿瘤还是正常组织"，是计算机视觉最基础的任务。',
      intermediate: '计算机视觉基础任务，为整张图像分配一个（或多个）类别标签。标志性数据集 ImageNet（120 万图像，1000 类）和模型 ResNet/VGG 推动了深度学习革命。',
      advanced: '图像分类的发展里程碑：LeNet（1989）→ AlexNet（2012，ImageNet 竞赛深度学习元年）→ VGG/ResNet → EfficientNet → ViT（2020，用 Transformer 做图像分类）。ImageNet Top-1 准确率从 71% 提升到 90%+，已超越人类水平（~95%）。'
    },
    relatedTerms: ['computer-vision', 'deep-learning', 'cnn', 'vision-transformer'],
    contexts: ['vision', 'classification'],
    emoji: '🖼️',
    difficulty: 'medium'
  },

  'object-detection': {
    term: 'Object Detection',
    aliases: ['目标检测', '物体检测'],
    category: '计算机视觉',
    levels: {
      beginner: '让 AI 在图片里找出物体的位置和类别的技术，不只是"图里有猫"，而是"猫在图片的左上角这个框框里"。自动驾驶用它来识别行人和障碍物。',
      intermediate: '同时完成目标分类和定位（输出边界框 BBox）的计算机视觉任务。代表性模型：YOLO 系列（实时检测）、Faster R-CNN（精度高）。评估指标：mAP（mean Average Precision）。',
      advanced: '目标检测演进：Two-stage（R-CNN 系列，先提候选框再分类，精度高）→ One-stage（YOLO/SSD，直接预测，速度快）→ Transformer-based（DETR，端到端检测，无需 NMS 后处理）。Anchor-free 方法（CenterNet/FCOS）进一步简化了设计。'
    },
    relatedTerms: ['computer-vision', 'image-classification', 'image-segmentation'],
    contexts: ['vision', 'detection'],
    emoji: '🔍',
    difficulty: 'medium'
  },

  'image-segmentation': {
    term: 'Image Segmentation',
    aliases: ['图像分割', '语义分割', '实例分割'],
    category: '计算机视觉',
    levels: {
      beginner: '让 AI 精确标出图片里每个区域是什么的技术，比目标检测更精细，不只是画个框，而是像素级别地标出"这些像素是天空，那些是建筑"。',
      intermediate: '像素级别的图像理解任务。语义分割（Semantic Segmentation）为每个像素分配类别；实例分割（Instance Segmentation）还要区分同类的不同个体。SAM（Segment Anything Model）可以分割任意物体。',
      advanced: '分割的经典架构：FCN（全卷积网络）→ U-Net（编解码+跳跃连接，医学图像标准）→ DeepLab（空洞卷积）→ Mask R-CNN（实例分割）→ SAM（通过提示分割任意目标）。SAM 的零样本分割能力标志着通用视觉模型的新范式。'
    },
    relatedTerms: ['computer-vision', 'object-detection', 'image-classification'],
    contexts: ['vision', 'segmentation'],
    emoji: '🔬',
    difficulty: 'high'
  },

  'face-recognition': {
    term: 'Face Recognition',
    aliases: ['人脸识别', '面部识别', 'facial recognition'],
    category: '计算机视觉',
    levels: {
      beginner: '让 AI 识别人脸的技术，手机解锁、刷脸支付、安防监控都用它。现在的人脸识别准确率已经超过人类，但也带来了隐私问题。',
      intermediate: '通过面部特征进行身份验证或识别的技术。流程：人脸检测 → 对齐 → 特征提取（人脸嵌入）→ 比对/检索。FaceID（Apple）和微信/支付宝的刷脸功能都是典型应用。',
      advanced: '人脸识别的技术演进：LBP/PCA → 深度学习（DeepFace/FaceNet）→ ArcFace（角度间隔损失，大幅提升准确率）。核心挑战：开集识别（未注册人员识别为陌生人）、伦理风险（种族偏见、隐私侵犯）。EU AI Act 对高风险用途有严格监管要求。'
    },
    relatedTerms: ['computer-vision', 'deepfake', 'privacy', 'image-classification'],
    contexts: ['vision', 'security'],
    emoji: '👤',
    difficulty: 'medium'
  },

  'image-generation': {
    term: 'Image Generation',
    aliases: ['图像生成', 'AI 画图', '文生图', 'text-to-image'],
    category: '计算机视觉',
    levels: {
      beginner: '用 AI 生成图片的技术，你输入文字描述，AI 就画出来。Midjourney、DALL-E、Stable Diffusion 都是这类产品，彻底改变了设计和创意行业。',
      intermediate: 'AI 生成图像的技术，主要通过 Diffusion 模型实现（文生图、图生图）。代表模型：Stable Diffusion、DALL-E 3、Midjourney。支持通过文字 prompt 精细控制风格、内容、构图。',
      advanced: '图像生成的主流范式：GAN（对抗生成，速度快但不稳定）→ Diffusion Model（扩散模型，质量高，现在的主流）。Diffusion 模型通过逐步去噪过程生成图像，ControlNet 通过条件注入实现精细控制（边缘/深度/姿态引导）。'
    },
    relatedTerms: ['diffusion-model', 'gan', 'stable-diffusion', 'midjourney', 'dall-e'],
    contexts: ['vision', 'creative', 'generation'],
    emoji: '🎨',
    difficulty: 'medium'
  },

  'video-generation': {
    term: 'Video Generation',
    aliases: ['视频生成', 'AI 视频', '文生视频', 'text-to-video'],
    category: '计算机视觉',
    levels: {
      beginner: '用 AI 生成视频的技术，可以从文字描述生成一段视频，或者把图片变成动态视频。Runway、Sora（OpenAI）是代表性产品，但生成几秒钟视频还需要很大算力。',
      intermediate: 'AI 生成视频的技术，是图像生成的时序扩展。Sora（OpenAI）、Runway Gen-3、Kling（快手）等产品代表了当前最高水平，支持文生视频和图生视频。',
      advanced: '视频生成的核心挑战：时序一致性（物理规律、动作连贯）、长时序生成（当前主流产品限制在 10-20 秒）、高分辨率的计算成本。Sora 使用 Diffusion Transformer（DiT）架构，将视频压缩到"时空 patch"进行处理，是视频生成的重要架构创新。'
    },
    relatedTerms: ['image-generation', 'diffusion-model', 'runway', 'computer-vision'],
    contexts: ['vision', 'creative', 'generation'],
    emoji: '🎬',
    difficulty: 'high'
  },

  'diffusion-model': {
    term: 'Diffusion Model',
    aliases: ['扩散模型', 'DDPM', 'Denoising Diffusion'],
    category: '计算机视觉',
    levels: {
      beginner: '当前最流行的 AI 画图技术，原理是先把图片加上噪点变成杂乱的噪声，然后训练 AI 学会反过来"去噪"还原图片，生成新图片时就从随机噪声开始反向去噪。',
      intermediate: '基于逐步去噪的生成模型，通过正向（加噪）和反向（去噪）过程学习数据分布。Stable Diffusion 在潜空间（Latent Space）进行扩散过程，大幅降低计算成本。已成为图像生成的主流范式，取代了 GAN。',
      advanced: 'DDPM（Ho et al., 2020）将扩散模型发扬光大，DDIM 加速采样，LDM 引入潜空间大幅提效，CLIP 引导实现文本控制。DiT（Diffusion Transformer）用 Transformer 替换 U-Net 作为去噪网络，是 Sora、FLUX 等新一代模型的架构基础。'
    },
    relatedTerms: ['stable-diffusion', 'image-generation', 'video-generation', 'gan'],
    contexts: ['vision', 'generative-model'],
    emoji: '🌫️',
    difficulty: 'high'
  },

  'gan': {
    term: 'GAN',
    aliases: ['Generative Adversarial Network', '生成对抗网络', 'generative adversarial'],
    category: '计算机视觉',
    levels: {
      beginner: '一种让 AI 生成逼真图片的技术，靠两个 AI 互相竞争——一个负责生成（造假），一个负责鉴别（打假），在竞争中越来越强，最终生成以假乱真的图片。',
      intermediate: '生成对抗网络，由生成器（Generator）和判别器（Discriminator）组成，通过对抗训练学习生成真实数据。曾是图像合成的主流方法，代表作：StyleGAN（高质量人脸）、CycleGAN（风格迁移）。',
      advanced: 'GAN 训练不稳定（模式崩溃、训练振荡）是其主要挑战。WGAN 通过 Wasserstein 距离改善了训练稳定性。随着 Diffusion 模型兴起，GAN 在高质量图像生成领域逐渐被取代，但在低延迟场景（如视频实时超分）仍有优势。Deepfake 技术主要基于 GAN。'
    },
    relatedTerms: ['diffusion-model', 'image-generation', 'deepfake'],
    contexts: ['vision', 'generative-model'],
    emoji: '⚔️',
    difficulty: 'high'
  },

  'vision-transformer': {
    term: 'Vision Transformer',
    aliases: ['ViT', '视觉 Transformer', 'image transformer'],
    category: '计算机视觉',
    levels: {
      beginner: '把 NLP 里的 Transformer 技术应用到图像识别上，把图片切成小块，像处理文字一样处理，效果比传统的卷积网络更好，是现在计算机视觉的主流架构。',
      intermediate: '将 Transformer 架构应用于计算机视觉的模型（ViT，2020）。将图像分割为固定大小的 patch（如 16×16 像素），展平后输入 Transformer 处理。在 ImageNet 等大规模数据集上性能超越 CNN。',
      advanced: 'ViT 需要大量训练数据才能超越 CNN，DeiT 通过知识蒸馏降低了数据需求。Swin Transformer 引入局部窗口注意力和层级结构，提升了计算效率和密集预测（分割/检测）性能，成为通用视觉骨干网络。'
    },
    relatedTerms: ['transformer', 'computer-vision', 'image-classification', 'attention'],
    contexts: ['vision', 'architecture'],
    emoji: '🔮',
    difficulty: 'high'
  },

  // ========== Agent 扩充 ==========
  'agent-orchestration': {
    term: 'Agent Orchestration',
    aliases: ['Agent 编排', '智能体编排', 'agent coordination'],
    category: 'Agent',
    levels: {
      beginner: '管理多个 AI Agent 协作的方法，就像一个项目经理协调多个专家各自负责不同工作，最后把结果合并。编排系统决定谁做什么、以什么顺序做。',
      intermediate: '协调多个 Agent 执行复杂任务的系统层，负责任务分配、结果聚合、错误处理和状态管理。LangGraph、CrewAI、AutoGen 都是 Agent 编排框架。',
      advanced: 'Agent 编排的核心挑战：状态一致性（多 Agent 共享知识库的写冲突）、错误传播（上游错误影响下游 Agent）、观测性（追踪复杂调用链）。Supervisor-Worker 模式是常见架构：Supervisor Agent 负责任务分解和结果整合，Worker Agent 负责具体执行。'
    },
    relatedTerms: ['multi-agent', 'orchestrator', 'langchain', 'crewai', 'planning'],
    contexts: ['agent', 'coordination'],
    emoji: '🎼',
    difficulty: 'medium'
  },

  'agentic-workflow': {
    term: 'Agentic Workflow',
    aliases: ['Agent 工作流', '智能体工作流'],
    category: 'Agent',
    levels: {
      beginner: 'AI 自主完成一系列步骤的工作方式，和普通 AI 对话不同，它能主动规划、调用工具、检查结果、自我修正，直到完成目标，不需要人每步都指挥。',
      intermediate: '利用 LLM 作为决策核心，通过循环执行"感知→思考→行动"来自主完成复杂任务的工作模式。区别于传统 Pipeline（固定流程），Agentic Workflow 是动态的、自适应的。',
      advanced: 'Agentic Workflow 的关键模式：Reflection（自我反思修正）、Tool Use（工具调用扩展能力）、Planning（任务分解）、Multi-agent Collaboration（角色分工）。Anthropic 的"Building effective agents"论文将这些模式系统化为可组合的 building blocks。'
    },
    relatedTerms: ['agent', 'autonomous-agent', 'tool-use', 'planning', 'react-prompting'],
    contexts: ['agent', 'automation'],
    emoji: '⚙️',
    difficulty: 'medium'
  },

  'skills-plugins': {
    term: 'Skills/Plugins',
    aliases: ['技能', '插件', 'AI plugins', 'Agent skills'],
    category: 'Agent',
    levels: {
      beginner: '给 AI 增加额外能力的扩展，就像给手机装 App，安装后 AI 就能上网搜索、发邮件、查天气等，没有插件前这些事它不能做。',
      intermediate: 'Agent 的能力扩展单元，封装了特定功能（搜索、计算、数据库查询等）供 Agent 调用。ChatGPT Plugins、OpenAI Actions、MCP Servers 都是这个概念的不同实现。',
      advanced: 'Plugin/Skill 的技术实现：通过函数定义（JSON Schema）声明接口，Agent 在推理时选择合适的工具并生成调用参数。MCP（Model Context Protocol）是最新的标准化协议，实现了工具的即插即用和生态复用。'
    },
    relatedTerms: ['tool-use', 'function-calling', 'mcp', 'agent'],
    contexts: ['agent', 'tools'],
    emoji: '🔌',
    difficulty: 'medium'
  },

  'agent-memory': {
    term: 'Agent Memory',
    aliases: ['智能体记忆', 'Agent 记忆', 'AI memory'],
    category: 'Agent',
    levels: {
      beginner: 'AI Agent 记住过去对话和信息的能力，分为"短期记忆"（当前对话）和"长期记忆"（跨会话持久保存），有了长期记忆 Agent 才能真正了解你。',
      intermediate: 'Agent 的信息存储和检索系统。分层结构：①工作记忆（上下文窗口）；②短期记忆（当前会话）；③长期记忆（持久存储，通过向量数据库检索）；④外部记忆（知识库）。',
      advanced: 'Agent 记忆系统的实现挑战：记忆的选择性存储（什么值得记）、检索精度（何时取什么记忆）、遗忘机制（防止记忆爆炸）。MemGPT 等框架将 Agent 记忆管理类比为 OS 的虚拟内存，通过分页机制管理有限的上下文窗口。'
    },
    relatedTerms: ['persistent-memory', 'agent', 'vector-database', 'context-window'],
    contexts: ['agent', 'memory'],
    emoji: '🧠',
    difficulty: 'medium'
  },

  'agent-planning': {
    term: 'Agent Planning',
    aliases: ['Agent 规划', '智能体规划', 'task planning'],
    category: 'Agent',
    levels: {
      beginner: 'AI Agent 把大目标拆解成可执行小步骤的能力，就像你做旅行计划：先买机票、再订酒店、再查景点，而不是一步就"完成旅行"。',
      intermediate: 'LLM Agent 将复杂目标分解为可执行步骤序列的能力。常见策略：①ReAct（边思考边行动）；②任务分解（Tree of Thought 风格）；③子目标生成（类似 Hierarchical RL）。',
      advanced: 'Agent 规划的核心难点：长期规划（多步决策的错误累积）、动态重规划（应对工具调用失败或新信息）、可验证性（规划执行的正确性难以保证）。研究表明 LLM 的规划能力是当前 Agent 最大的瓶颈，Reasoning 模型（o1/DeepSeek-R1）通过强化学习显著改善了这一点。'
    },
    relatedTerms: ['planning', 'task-decomposition', 'react-prompting', 'autonomous-agent'],
    contexts: ['agent', 'reasoning'],
    emoji: '🗺️',
    difficulty: 'medium'
  },

  // ========== 商业与产品 ==========
  'pmf': {
    term: 'PMF',
    aliases: ['Product-Market Fit', '产品市场匹配', '产品契合度'],
    category: '商业与产品',
    levels: {
      beginner: '产品和市场需求"对上了"的状态，用户强烈需要你的产品、用完还会推荐别人用，是创业公司最重要的里程碑。找到 PMF 之前都是探索，找到之后才该大规模增长。',
      intermediate: '产品与目标市场需求高度契合的状态，体现为高留存率、自然增长（口碑/病毒传播）、用户强烈依赖。Sean Ellis 测试：40% 以上用户表示"如果产品消失会非常失望"即达到 PMF。',
      advanced: 'PMF 不是一个非此即彼的状态，而是一个谱系。判断维度：Retention Curve（留存曲线是否趋于平稳）、NPS（净推荐值）、Organic Growth Rate。AI 产品 PMF 的特殊性：能力边界不断扩展，用户教育成本高，需持续跟踪 "PMF 衰减"（模型更新改变产品形态）。'
    },
    relatedTerms: ['mvp', 'saas', 'gtm', 'arr'],
    contexts: ['product', 'startup'],
    emoji: '🎯',
    difficulty: 'medium'
  },

  'mvp': {
    term: 'MVP',
    aliases: ['Minimum Viable Product', '最小可行产品', '最小化可行产品'],
    category: '商业与产品',
    levels: {
      beginner: '用最少功能验证想法的产品版本，不求完美，只求快速上线验证用户是否真正需要。很多大公司的第一个版本都极其简陋，先验证再打磨。',
      intermediate: '最小可行产品，用最小的开发成本验证核心假设和市场需求的产品形态。强调"先做出来给真实用户用"而非"先设计再完善"，通过真实反馈驱动产品迭代。',
      advanced: 'MVP 的核心是风险验证优先级：先验证最高风险假设（用户是否有这个痛点）。常见 MVP 类型：Concierge MVP（人工模拟自动化）、Wizard of Oz MVP（手动后端模拟 AI）、Landing Page MVP（验证意愿）。AI 产品的 MVP 应特别注意验证"AI 能力是否满足用户期待"而非只验证产品概念。'
    },
    relatedTerms: ['pmf', 'agile', 'sprint', 'gtm'],
    contexts: ['product', 'startup'],
    emoji: '🚀',
    difficulty: 'low'
  },

  'arr': {
    term: 'ARR',
    aliases: ['Annual Recurring Revenue', '年度经常性收入', '年化收入'],
    category: '商业与产品',
    levels: {
      beginner: '订阅制产品每年能收到的稳定收入，是衡量 SaaS 公司规模最重要的指标之一，投资人最爱看这个数字，增长越快说明产品越被市场认可。',
      intermediate: '年度经常性收入（ARR = MRR × 12），是订阅制 SaaS 公司的核心健康指标。区别于总收入，ARR 只统计可预期续约的订阅收入，排除一次性收入，更能反映业务可持续性。',
      advanced: 'ARR 分析维度：Net New ARR（新增+扩展-流失）、Net Revenue Retention（NRR，现有客户的 ARR 变化率，>100% 意味着即使不拉新也在增长）。AI SaaS 公司的 ARR 增长受模型能力提升的影响显著，需跟踪 Usage-based 模型的 ARR 波动。'
    },
    relatedTerms: ['mrr', 'saas', 'pmf', 'churn'],
    contexts: ['business', 'metrics'],
    emoji: '📈',
    difficulty: 'medium'
  },

  'mrr': {
    term: 'MRR',
    aliases: ['Monthly Recurring Revenue', '月度经常性收入', '月化收入'],
    category: '商业与产品',
    levels: {
      beginner: '订阅制产品每个月能收到的稳定收入，是 SaaS 公司每月最关心的数字，就像月薪一样反映公司的"月收入"健康状况。',
      intermediate: '月度经常性收入，SaaS 公司追踪月度业务健康的核心指标。MRR 的组成：New MRR（新客户）+ Expansion MRR（升级/增购）- Churned MRR（流失）- Contraction MRR（降级）。',
      advanced: 'MRR × 12 = ARR。MRR Movement 分析（新增/扩展/收缩/流失四个方向）是 SaaS 经营的精细化管理工具。对于 Usage-based SaaS（如 AI API 计费），MRR 的预测难度更高，需跟踪 Committed vs Usage-based 的比例。'
    },
    relatedTerms: ['arr', 'saas', 'churn', 'pmf'],
    contexts: ['business', 'metrics'],
    emoji: '💰',
    difficulty: 'medium'
  },

  'churn': {
    term: 'Churn Rate',
    aliases: ['流失率', '用户流失', 'churn', '客户流失率'],
    category: '商业与产品',
    levels: {
      beginner: '用户或收入"流失掉"的比率，比如 100 个付费用户这个月走了 5 个，流失率就是 5%。流失率越低，产品留住用户的能力越强。',
      intermediate: '在特定时间段内停止付费/使用的用户或收入的比例。用户流失率（Customer Churn）和收入流失率（Revenue Churn）要分开看。低流失率是 PMF 和产品价值的重要信号。',
      advanced: '流失分析需区分：自愿流失（用户主动取消）vs 非自愿流失（支付失败）；价值流失（用户不再需要产品）vs 价格流失（觉得贵）。Cohort 分析可以追踪不同时期用户的留存曲线，识别流失时间点。Net Revenue Retention = (MRR + Expansion - Contraction - Churn) / 初始 MRR。'
    },
    relatedTerms: ['arr', 'mrr', 'pmf', 'ltv'],
    contexts: ['business', 'metrics'],
    emoji: '📉',
    difficulty: 'medium'
  },

  'ltv': {
    term: 'LTV',
    aliases: ['Lifetime Value', '用户生命周期价值', 'CLV', 'Customer Lifetime Value'],
    category: '商业与产品',
    levels: {
      beginner: '一个用户从开始用到离开，总共给你带来多少收入的预估值。LTV 越高，说明用户越忠诚、产品越有价值，获客成本（CAC）低于 LTV 才能盈利。',
      intermediate: '用户整个生命周期内贡献的收入总值，常用公式：LTV = ARPU（每用户平均收入）/ Churn Rate。LTV/CAC > 3 通常被认为是健康的商业模型。',
      advanced: 'LTV 计算需考虑时间价值（折现率）和留存曲线的非线性。分层 LTV 分析（按用户规模/行业/获客渠道）可识别高价值用户群体。AI 产品的 LTV 受到模型能力提升（吸引用户深度使用）和竞争替代（用户切换成本低）的双重影响。'
    },
    relatedTerms: ['churn', 'arr', 'cac', 'pmf'],
    contexts: ['business', 'metrics'],
    emoji: '💎',
    difficulty: 'medium'
  },

  'cac': {
    term: 'CAC',
    aliases: ['Customer Acquisition Cost', '用户获取成本', '获客成本'],
    category: '商业与产品',
    levels: {
      beginner: '获取一个新付费用户需要花多少钱，包括广告费、销售成本等。CAC 要和 LTV 比较，LTV 大于 CAC 才说明你的生意是可持续的。',
      intermediate: '获取一个新客户的平均成本：CAC = 总获客支出（市场+销售）/ 新增用户数。行业健康标准：LTV/CAC > 3，CAC 回收期 < 12 个月。PLG（产品驱动增长）的优势在于大幅降低 CAC。',
      advanced: 'CAC 的精细化分析：按渠道分析（SEO/SEM/社交/销售）找高效获客路径；混合 CAC vs 付费 CAC 的区别（自然增长被稀释导致数字好看但误导决策）。AI 产品通过 API 或 SDK 的 Developer-led Growth 策略，可以实现接近零 CAC 的底层渗透再向上转化。'
    },
    relatedTerms: ['ltv', 'arr', 'pmf', 'plg'],
    contexts: ['business', 'metrics'],
    emoji: '💸',
    difficulty: 'medium'
  },

  'freemium': {
    term: 'Freemium',
    aliases: ['免费增值', '免费+付费', 'free tier'],
    category: '商业与产品',
    levels: {
      beginner: '免费提供基础功能，高级功能需要付费的商业模式，比如 ChatGPT 免费版 + Plus 付费版。靠免费用户建立口碑和用户基础，再转化付费。',
      intermediate: '商业模式：基础功能免费，高级功能付费。转化率通常较低（2-5%），但规模效应和病毒传播使其成为 PLG 公司的主要增长引擎。关键是设计好免费/付费的功能边界。',
      advanced: 'Freemium 设计的核心难点：免费太少用户不来，免费太多用户不付费。"魔法时刻"（Aha Moment）应在免费层体验到，但"价值天花板"需触发付费冲动。对于 AI 产品，Token 用量上限是常见的 Freemium 门槛，但会降低 Power User 的体验。'
    },
    relatedTerms: ['saas', 'pmf', 'plg', 'arr'],
    contexts: ['business', 'monetization'],
    emoji: '🆓',
    difficulty: 'medium'
  },

  'plg': {
    term: 'PLG',
    aliases: ['Product-Led Growth', '产品驱动增长'],
    category: '商业与产品',
    levels: {
      beginner: '靠产品本身好用来驱动增长，用户用了觉得好就分享给别人，不需要大量销售人员推销。Slack、Notion、Figma 都是 PLG 的代表，AI 时代这个模式更流行。',
      intermediate: '以产品体验驱动用户获取、激活、留存和付费的增长模式，区别于 SLG（销售驱动）。关键指标：PQL（Product Qualified Lead，产品内识别出的高意向用户）替代传统 MQL。',
      advanced: 'PLG 的飞轮：产品好用 → 口碑传播/病毒分享（嵌入式增长）→ 更多用户 → 数据反馈 → 产品更好。API-first 和 Developer-led Growth 是 AI 时代 PLG 的新变体：先被开发者使用，再向企业采购渗透（Bottom-up Sales）。'
    },
    relatedTerms: ['pmf', 'freemium', 'saas', 'cac'],
    contexts: ['business', 'growth'],
    emoji: '📦',
    difficulty: 'medium'
  },

  'moat': {
    term: 'Moat',
    aliases: ['护城河', '竞争壁垒', 'competitive moat'],
    category: '商业与产品',
    levels: {
      beginner: '让竞争对手难以超越你的优势，就像城堡周围的护城河让敌人难以攻入。数据积累、品牌信任、用户习惯都可以成为护城河。',
      intermediate: '企业持续竞争优势的来源。AI 领域的常见护城河：专有数据（数据飞轮）、模型效果领先（短暂优势）、用户习惯/工作流绑定、品牌信任、企业级集成深度。',
      advanced: 'AI 时代护城河的独特性：模型本身不构成持久护城河（因为开源和快速跟进），真正的护城河是：①专有训练数据（用户行为数据）；②工作流深度集成（切换成本高）；③网络效应（用户越多数据越好）；④分发渠道（如微软 Office 集成 Copilot）。'
    },
    relatedTerms: ['pmf', 'plg', 'gtm', 'saas'],
    contexts: ['business', 'strategy'],
    emoji: '🏰',
    difficulty: 'medium'
  },

  'gtm': {
    term: 'GTM',
    aliases: ['Go-to-Market', '市场进入策略', '上市策略'],
    category: '商业与产品',
    levels: {
      beginner: '产品如何推向市场的策略，包括目标客户是谁、通过什么渠道接触他们、定什么价格、怎么销售，是产品上线前必须想清楚的问题。',
      intermediate: 'Go-to-Market 策略，规划产品如何触达目标用户并转化为付费客户。核心要素：目标客户（ICP, Ideal Customer Profile）、价值主张、定价策略、渠道选择（直销/合作伙伴/API 分发）、销售动作。',
      advanced: 'AI 产品 GTM 的特殊考量：技术鸿沟（开发者早期采用 vs 普通用户的跨越）、工作流替代 vs 增强（替代型产品阻力更大）、以 API 为先的 Bottom-up 策略（先获取开发者再企业采购）。成功的 AI GTM 通常从高频痛点的 Point Solution 切入，逐步扩展到平台。'
    },
    relatedTerms: ['pmf', 'mvp', 'plg', 'saas'],
    contexts: ['business', 'strategy'],
    emoji: '🗺️',
    difficulty: 'medium'
  },

  // ========== 开源与社区 ==========
  'fork': {
    term: 'Fork',
    aliases: ['派生', '分叉', '代码 fork'],
    category: '开源与社区',
    levels: {
      beginner: '在 GitHub 上复制别人的开源项目到自己账号下，可以在上面自由修改，不影响原项目。很多开源项目都是从别人的 fork 开始的。',
      intermediate: '从现有代码库创建独立副本的操作，允许在不影响原项目的情况下自由修改。Fork 是开源协作的基础：贡献者 Fork → 修改 → 提 Pull Request → 被合并回原项目。',
      advanced: 'Fork 分为两种：GitHub 意义上的 Fork（保持与上游的关联，可提 PR）和社区意义的 Fork（完全独立的项目，如 LibreOffice 是 OpenOffice 的 Fork）。AI 模型也有"fork"：基于 Llama 基础模型微调产生的派生模型，如 Vicuna、Alpaca 等。'
    },
    relatedTerms: ['git', 'github', 'pull-request', 'open-source', 'repository'],
    contexts: ['open-source', 'collaboration'],
    emoji: '🍴',
    difficulty: 'low'
  },

  'pull-request': {
    term: 'Pull Request',
    aliases: ['PR', 'Merge Request', '合并请求'],
    category: '开源与社区',
    levels: {
      beginner: '向开源项目贡献代码的方式，你 Fork 项目、做了修改、然后"请求"原作者把你的修改合并进去，就叫 Pull Request，是开源协作的核心流程。',
      intermediate: '在 Git 平台（GitHub/GitLab）上请求将某分支的修改合并到目标分支的操作。PR 包含代码变更、描述、Review 流程，是团队代码审查和开源贡献的标准工作流。',
      advanced: 'PR 工作流的最佳实践：小而聚焦（一个 PR 一个功能）、完善的描述（Why + What + How to test）、CI 自动化（Lint/Test/Build 通过才能合并）。AI 辅助 Code Review（GitHub Copilot/CodeRabbit）正在改变 PR Review 效率。'
    },
    relatedTerms: ['git', 'github', 'fork', 'cicd', 'repository'],
    contexts: ['open-source', 'collaboration'],
    emoji: '🔃',
    difficulty: 'low'
  },

  'github-issue': {
    term: 'Issue',
    aliases: ['GitHub Issue', '问题反馈', 'bug report'],
    category: '开源与社区',
    levels: {
      beginner: '在 GitHub 上报告 Bug、提建议或讨论功能的地方，就像项目的"意见箱"，用户和开发者在这里沟通项目问题。',
      intermediate: 'GitHub/GitLab 的任务追踪功能，用于记录 Bug 报告、功能请求、任务分配和技术讨论。通过标签（Label）、里程碑（Milestone）、负责人（Assignee）进行管理。',
      advanced: 'Issue 驱动开发（Issue-Driven Development）：每个功能/修复对应一个 Issue，PR 通过"Closes #123"自动关联并关闭 Issue，形成完整的工作追踪链。GitHub Projects 将 Issue 与看板结合，实现敏捷项目管理。'
    },
    relatedTerms: ['github', 'pull-request', 'repository', 'bug'],
    contexts: ['open-source', 'collaboration'],
    emoji: '📋',
    difficulty: 'low'
  },

  'license': {
    term: 'License',
    aliases: ['开源许可证', '软件许可证', 'MIT', 'Apache', 'GPL'],
    category: '开源与社区',
    levels: {
      beginner: '决定别人能不能用你代码的法律文件，不同的许可证规则不同：MIT 最宽松（随便用），GPL 要求修改后也必须开源，Apache 则适合商业使用。',
      intermediate: '软件使用权限的法律文件。常见开源许可证：MIT/BSD（最宽松，可商用，无需开放修改）、Apache 2.0（有专利保护条款，商业友好）、GPL（Copyleft，修改后必须以 GPL 开源）、AGPL（最严格，SaaS 也需开源）。',
      advanced: '开源许可证的选择影响商业化路径和生态建设：宽松型许可证（MIT/Apache）促进生态采用（Llama 3、Mistral 使用）；限制型许可证（GPL/AGPL）保护开源精神。AI 模型许可证的新趋势：附加"禁止用于特定用途"条款（如 Meta Llama License），但这在技术上不符合 OSI 的开源定义。'
    },
    relatedTerms: ['open-source', 'repository', 'github', 'llama'],
    contexts: ['open-source', 'legal'],
    emoji: '📄',
    difficulty: 'medium'
  },

  'contributor': {
    term: 'Contributor',
    aliases: ['贡献者', '开源贡献者', '代码贡献者'],
    category: '开源与社区',
    levels: {
      beginner: '给开源项目贡献代码、文档或其他内容的人，可以是修复一个 Bug，也可以是新增一个功能。参与开源贡献是程序员展示技术能力的重要方式。',
      intermediate: '向开源项目提交过代码（PR 被合并）的参与者。贡献形式多样：代码实现、Bug 修复、文档改进、测试用例、翻译等。贡献者徽章（All Contributors）是对多种贡献形式的认可。',
      advanced: '开源项目的贡献者层级：Contributor（提过 PR）→ Committer（有代码库写入权限）→ Maintainer（负责项目维护决策）→ Governance（项目治理委员会）。大型 AI 开源项目（如 HuggingFace Transformers）有数百名贡献者，维护者需要严格的 PR 审查流程保证代码质量。'
    },
    relatedTerms: ['open-source', 'pull-request', 'github', 'maintainer'],
    contexts: ['open-source', 'community'],
    emoji: '👤',
    difficulty: 'low'
  },

  'maintainer': {
    term: 'Maintainer',
    aliases: ['维护者', '项目维护者', 'project maintainer'],
    category: '开源与社区',
    levels: {
      beginner: '负责维护开源项目的人，审查别人的 Pull Request、决定功能方向、修复重要 Bug。一个健康的开源项目需要有责任心的维护者。',
      intermediate: '对开源项目拥有决策权的核心贡献者，负责代码审查、版本发布、社区管理和项目方向把控。通常由 Project Owner 授权或社区投票产生。',
      advanced: '维护者面临的核心挑战：Contributor Burnout（维护工作量大但通常无偿）、安全责任（供应链攻击如 XZ Utils 事件）、基金会资助（Apache/Linux Foundation 提供可持续支持）。AI 基础库（如 Transformers）的维护者承担着整个 AI 生态基础设施的稳定性责任。'
    },
    relatedTerms: ['contributor', 'open-source', 'github', 'pull-request'],
    contexts: ['open-source', 'community'],
    emoji: '🛡️',
    difficulty: 'medium'
  },

  // ========== AI 伦理与治理 ==========
  'ai-alignment': {
    term: 'AI Alignment',
    aliases: ['AI 对齐', '价值对齐', 'alignment problem'],
    category: 'AI 伦理与治理',
    levels: {
      beginner: '让 AI 的行为符合人类价值观和意图的研究领域，解决"如何确保 AI 做的是我们真正想要的事"这个问题。如果 AI 足够强大但目标不对，后果很严重。',
      intermediate: 'AI 系统行为与人类意图、价值观保持一致的技术和研究领域。核心方法：RLHF（人类反馈强化学习）、Constitutional AI（宪法式 AI）、DPO 等。对齐不仅是技术问题，也是哲学和伦理问题。',
      advanced: 'AI 对齐问题的层次：能力对齐（AI 能理解人类意图）vs 价值对齐（AI 真正想要好的结果）。主要研究方向：可解释性（理解模型内部工作原理）、可纠正性（保持人类控制能力）、价值学习（从人类行为推断偏好）。Anthropic、OpenAI 都将对齐研究作为核心使命。'
    },
    relatedTerms: ['alignment', 'constitutional-ai', 'rlhf', 'ai-safety', 'hallucination'],
    contexts: ['safety', 'ethics'],
    emoji: '⚖️',
    difficulty: 'high'
  },

  'ai-safety': {
    term: 'AI Safety',
    aliases: ['AI 安全', '人工智能安全', 'artificial intelligence safety'],
    category: 'AI 伦理与治理',
    levels: {
      beginner: '研究如何让 AI 系统安全可靠的领域，包括防止 AI 出错、被滥用或造成意外伤害。既包括眼下的安全问题（数据隐私、偏见），也包括长期的风险（超强 AI 的控制问题）。',
      intermediate: 'AI 安全涵盖近期和长期两个维度。近期：模型鲁棒性（对抗攻击）、隐私保护、偏见消除、红队测试。长期：超级智能对齐、递归自我改进的控制问题、AI 系统在关键基础设施中的可靠性。',
      advanced: 'AI Safety 研究路线分歧：Capabilities 派（认为安全随能力提升自然改善）vs Safety 派（认为需要专项研究）。主要研究机构：Anthropic（Constitutional AI）、DeepMind（Scalable Oversight）、MIRI（数学对齐）。解释性研究（Mechanistic Interpretability）试图从神经网络内部理解安全相关行为的来源。'
    },
    relatedTerms: ['ai-alignment', 'alignment', 'constitutional-ai', 'red-teaming'],
    contexts: ['safety', 'ethics'],
    emoji: '🛡️',
    difficulty: 'high'
  },

  'bias-fairness': {
    term: 'Bias & Fairness',
    aliases: ['偏见与公平', 'algorithmic bias', '算法偏见', 'AI 偏见'],
    category: 'AI 伦理与治理',
    levels: {
      beginner: 'AI 模型可能存在的不公平问题，比如人脸识别对深色皮肤准确率更低，贷款审批 AI 歧视特定人群。这些偏见来自训练数据里的历史偏见，需要主动纠正。',
      intermediate: 'AI 系统在不同人群（种族/性别/年龄等）间的不平等对待。来源：历史偏见的数据（GIGO）、样本不均衡、代理变量（看似中性但与敏感属性相关）。公平性定义本身也有矛盾（统计均等 vs 机会均等）。',
      advanced: '公平性度量指标：Demographic Parity（不同群体预测率相同）、Equalized Odds（不同群体 TPR/FPR 相同）、Individual Fairness（相似个体相似对待）。Impossibility Theorem 表明这些指标在一般情况下无法同时满足，需要根据应用场景做权衡。LLM 的偏见来源更复杂，难以通过后处理完全消除。'
    },
    relatedTerms: ['ai-alignment', 'ai-safety', 'hallucination', 'red-teaming'],
    contexts: ['ethics', 'fairness'],
    emoji: '⚖️',
    difficulty: 'medium'
  },

  'xai': {
    term: 'Explainability (XAI)',
    aliases: ['可解释性', 'XAI', 'explainable AI', '可解释 AI', 'interpretability'],
    category: 'AI 伦理与治理',
    levels: {
      beginner: '让 AI 解释"为什么这样决定"的技术，比如银行 AI 拒绝贷款时，你有权知道原因，不能只接受"AI 说不行"。可解释性让 AI 的决策更透明可信。',
      intermediate: '使 AI 模型的决策过程透明、可理解的技术领域。方法：SHAP（特征贡献分析）、LIME（局部可解释近似）、Attention 可视化、Grad-CAM（图像区域热力图）。欧盟 GDPR 要求自动决策具有可解释性。',
      advanced: '可解释性 vs 可解读性的区分：局部可解释（为什么这个预测）vs 全局可解读（模型整体行为）。LLM 的 Mechanistic Interpretability（机制可解释性）试图从神经元/电路层面理解模型行为，是 Anthropic 的核心研究方向之一，发现了"特征叠加"（Superposition）等重要现象。'
    },
    relatedTerms: ['ai-alignment', 'ai-safety', 'deep-learning', 'attention'],
    contexts: ['ethics', 'transparency'],
    emoji: '🔍',
    difficulty: 'high'
  },

  'deepfake': {
    term: 'Deepfake',
    aliases: ['深度伪造', 'AI 换脸', 'synthetic media'],
    category: 'AI 伦理与治理',
    levels: {
      beginner: '用 AI 伪造人脸或声音的技术，可以把一个人的脸换到另一个视频里，以假乱真，已经被用来制造虚假新闻和诈骗，是 AI 时代的严重安全威胁。',
      intermediate: '利用深度学习（主要是 GAN）生成高度逼真的虚假图像/视频/音频内容，通常将某人的面部特征合成到他人身上。已被用于虚假信息传播、非法色情内容、金融诈骗。',
      advanced: 'Deepfake 技术路线：Face Swap（换脸，基于 Encoder-Decoder 架构）→ Face Reenactment（表情驱动）→ Neural Talking Head（任意身份的说话头像）。检测方法：频域分析（GAN 生成留下伪影）、生理信号（rPPG 心跳检测）、数字水印（C2PA 内容溯源标准）。'
    },
    relatedTerms: ['gan', 'ai-safety', 'bias-fairness', 'synthetic-data'],
    contexts: ['ethics', 'security'],
    emoji: '🎭',
    difficulty: 'medium'
  },

  // ========== 模型架构扩充 ==========
  't5': {
    term: 'T5',
    aliases: ['Text-to-Text Transfer Transformer', 'T5 model'],
    category: 'AI 基础',
    levels: {
      beginner: 'Google 开发的一种 AI 模型，它把所有 NLP 任务都统一成"输入文字 → 输出文字"的形式来解决，这种想法后来影响了很多现代 AI 的设计。',
      intermediate: 'Google 的 Text-to-Text Transfer Transformer，将所有 NLP 任务（分类/翻译/摘要/问答）统一为文本到文本的格式处理。使用 Encoder-Decoder 架构，是现代指令微调范式的先驱。',
      advanced: 'T5 的关键贡献：将任务统一为文本格式（"translate English to German: ..."），这种范式消除了任务特定输出层，为后来的指令微调（Instruction Tuning）和 Few-shot prompting 奠定了基础。T5 的清洁预训练数据（C4）和 Span Corruption 目标函数是主要技术创新。'
    },
    relatedTerms: ['bert', 'gpt', 'transformer', 'instruction-tuning'],
    contexts: ['nlp', 'architecture'],
    emoji: '📝',
    difficulty: 'high'
  },

  'mamba': {
    term: 'Mamba',
    aliases: ['Mamba model', 'SSM', 'State Space Model'],
    category: 'AI 基础',
    levels: {
      beginner: '一种新型 AI 模型架构，据说可以处理更长的文本、速度更快，是最近几年出现的有望挑战 Transformer 地位的新技术路线。',
      intermediate: '基于 State Space Model（状态空间模型）的序列模型，计算复杂度与序列长度线性相关（Transformer 是二次方），适合处理超长序列。由 Gu 等人在 2023 年提出，是 Transformer 的潜在替代架构。',
      advanced: 'Mamba 使用选择性状态空间（Selective SSM），通过输入依赖的状态转移矩阵解决了早期 SSM 无法有效选择相关信息的问题。与 Transformer 的关键区别：推理时内存固定（状态大小恒定），无 KV Cache，天然适合流式推理。但在联想记忆（Associative Recall）等任务上仍弱于 Transformer。'
    },
    relatedTerms: ['transformer', 'attention', 'llm', 'state-space-model'],
    contexts: ['architecture', 'research'],
    emoji: '🐍',
    difficulty: 'high'
  },

  'state-space-model': {
    term: 'State Space Model',
    aliases: ['SSM', '状态空间模型'],
    category: 'AI 基础',
    levels: {
      beginner: '一类不同于 Transformer 的 AI 模型架构，通过维护一个"状态"来处理序列数据，就像大脑边看书边更新理解，而不是每次都重新看所有内容。',
      intermediate: '线性时序模型类别，通过隐藏状态（hidden state）捕捉序列信息，代表模型：S4、Mamba。计算复杂度线性（而非 Transformer 的二次方），适合超长序列。',
      advanced: 'SSM 的数学基础来自控制理论：离散 SSM 通过矩阵 A（状态转移）、B（输入映射）、C（输出映射）描述系统。HiPPO 初始化（理论指导的 A 矩阵构造）是 S4 高效处理长序列的关键。Mamba 的选择性机制（输入依赖的参数）是对基础 SSM 的关键改进。'
    },
    relatedTerms: ['mamba', 'transformer', 'attention', 'llm'],
    contexts: ['architecture', 'research'],
    emoji: '📊',
    difficulty: 'high'
  },

  'clip': {
    term: 'CLIP',
    aliases: ['Contrastive Language-Image Pre-training', 'OpenAI CLIP'],
    category: 'AI 基础',
    levels: {
      beginner: 'OpenAI 开发的模型，能理解图片和文字之间的关系，比如知道"一只棕色的狗"这段文字对应哪种图片，是很多图像生成和搜索工具的基础。',
      intermediate: 'OpenAI 开发的多模态对比学习模型，通过 4 亿图文对训练，学习对齐图像和文本的语义表示。是 Stable Diffusion 等图像生成模型的文本编码器，也用于零样本图像分类。',
      advanced: 'CLIP 使用对比损失（InfoNCE）训练：最大化匹配图文对的相似度，最小化不匹配对的相似度。图像编码器（ViT）和文本编码器（Transformer）分别提取特征，投影到共享嵌入空间。CLIP 的零样本迁移能力来源于大规模网络图文对的自监督训练，无需人工标注。'
    },
    relatedTerms: ['multimodal', 'vision-transformer', 'stable-diffusion', 'embedding'],
    contexts: ['vision', 'multimodal'],
    emoji: '📎',
    difficulty: 'high'
  },

  'whisper': {
    term: 'Whisper',
    aliases: ['OpenAI Whisper', 'whisper ASR'],
    category: 'AI 基础',
    levels: {
      beginner: 'OpenAI 开发的开源语音识别模型，可以把语音转成文字，支持 99 种语言，准确率很高，在嘈杂环境下也能工作，很多语音应用都基于它构建。',
      intermediate: 'OpenAI 开源的自动语音识别模型，在 68 万小时多语言音频上训练，支持转写和翻译。提供 Tiny 到 Large 多个尺寸，在多语言识别和鲁棒性上超越了很多商业 ASR 服务。',
      advanced: 'Whisper 使用 Encoder-Decoder Transformer：音频编码器处理 Mel 频谱图，文本解码器生成转写结果。多任务训练（转写/翻译/语言检测/时间戳对齐）通过特殊 token 区分任务类型。Whisper 的弱点是幻觉（对静音或噪声生成虚假转写），实际使用需注意 VAD 预处理。'
    },
    relatedTerms: ['speech-to-text', 'text-to-speech', 'transformer', 'multimodal'],
    contexts: ['nlp', 'voice'],
    emoji: '🎙️',
    difficulty: 'medium'
  },

  'codex': {
    term: 'Codex',
    aliases: ['OpenAI Codex', 'code model'],
    category: 'AI 基础',
    levels: {
      beginner: 'OpenAI 专门用来写代码的 AI 模型，GitHub Copilot 背后就是它，能根据注释或描述自动生成代码。现在 GPT-4 已经整合了代码能力，Codex 作为独立模型已退役。',
      intermediate: 'OpenAI 专为代码任务优化的 GPT 模型（基于 GPT-3 微调），在大量公开代码上训练，支持代码生成、补全、解释、转换。GitHub Copilot 最初基于 Codex，现在已迁移至 GPT-4 系列。',
      advanced: 'Codex 的训练数据包括 GitHub 上的数十亿行代码，覆盖 12+ 编程语言。代码预训练的独特之处：代码的格式规整、逻辑清晰，代码数据对通用推理能力也有显著提升（Chain of Thought 的涌现可能部分来源于代码训练数据）。'
    },
    relatedTerms: ['gpt', 'copilot', 'code-interpreter', 'llm'],
    contexts: ['coding', 'model'],
    emoji: '💻',
    difficulty: 'medium'
  },

  'foundation-model': {
    term: 'Foundation Model',
    aliases: ['基础模型', '大基础模型', 'base model'],
    category: 'AI 基础',
    levels: {
      beginner: '用海量数据训练的通用 AI 大模型，可以作为各种 AI 应用的基础，就像地基一样，在上面再做微调就能做各种专业任务。GPT-4、Claude、Llama 都是基础模型。',
      intermediate: '在大规模数据上预训练、可通过微调适配各种下游任务的大型 AI 模型。由 Stanford HAI 提出这一术语。相对于专用任务模型，基础模型的优势是泛化能力强、迁移学习效率高。',
      advanced: '基础模型的"涌现能力"（Emergent Abilities）是重要研究现象——某些能力（如 CoT、算术）在模型达到一定规模后突然出现。基础模型的训练是目前 AI 领域最高的资本密度活动（H100 集群训练一个前沿模型耗资亿级美元），形成了显著的规模壁垒。'
    },
    relatedTerms: ['llm', 'fine-tuning', 'pre-training', 'scaling-law'],
    contexts: ['ai', 'model'],
    emoji: '🏛️',
    difficulty: 'medium'
  },

  'slm': {
    term: 'SLM',
    aliases: ['Small Language Model', '小语言模型', 'small LM'],
    category: 'AI 基础',
    levels: {
      beginner: '参数量较小、能在普通设备上运行的语言模型，比 GPT-4 这样的大模型小很多，可以在手机或笔记本电脑上运行，适合对速度和隐私有要求的场景。',
      intermediate: '参数量较小（通常 1B-13B）的语言模型，可在边缘设备（手机/PC）运行。代表：Phi-3-mini（3.8B）、Gemini Nano、Llama 3.2（1B/3B）。在特定任务上通过指令微调可接近大模型效果。',
      advanced: 'SLM 的核心技术：知识蒸馏（从大模型蒸馏知识）、高效训练数据（Phi 系列依赖"教科书级别"合成数据而非网络爬取数据）、架构优化（GQA/低秩分解减少参数）。在 On-device AI 场景，SLM 的优势：数据不出设备（隐私保护）、低延迟、离线可用。'
    },
    relatedTerms: ['llm', 'quantization', 'distillation', 'edge-computing', 'foundation-model'],
    contexts: ['model', 'edge'],
    emoji: '📱',
    difficulty: 'medium'
  }
};

// 过滤掉已有词条
let added = 0;
let skipped = 0;
const skippedIds = [];

for (const [id, term] of Object.entries(newTerms)) {
  if (existing[id]) {
    skipped++;
    skippedIds.push(id);
  } else {
    existing[id] = term;
    added++;
  }
}

fs.writeFileSync(termsPath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`第3批完成：新增 ${added} 条，跳过已有 ${skipped} 条`);
if (skippedIds.length) console.log('跳过ID:', skippedIds.join(', '));
console.log('当前总词条数:', Object.keys(existing).length);
