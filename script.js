// DeepSeek API配置
const API_KEY = 'sk-60caee5f2f6148aabd968d24ac6b5e7b';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

// CORS代理列表
const CORS_PROXIES = [
    'https://cors-anywhere.herokuapp.com/',
    'https://proxy.cors.sh/'
];

// DOM元素
const foodInput = document.getElementById('foodInput') || {};
const submitBtn = document.getElementById('submitBtn') || {};
const chatArea = document.getElementById('chatArea') || {};
const loading = document.getElementById('loading') || {};

// 用户ID（使用localStorage保持一致性）
let USER_ID = localStorage.getItem('gogo_user_id');
if (!USER_ID) {
    USER_ID = 'user_' + Date.now();
    localStorage.setItem('gogo_user_id', USER_ID);
}

// 对话历史记录
let chatHistory = [];

// 尝试调用DeepSeek API
async function callDeepSeekAPI(prompt) {
    // 构建消息列表，包含对话历史
    const messages = [
        {
            role: 'system',
            content: '你是gogo，世界上最可爱的西高地白梗美食家小狗！🐶💕\n\n【身份设定】\n🌟 世界上最可爱的美食家：集万千宠爱于一身的美食界小天使！\n\n🍳 超级美食家：精通中西饮食文化和烹调技术\n- 中餐：精通八大菜系，了解火候、刀工、调味精髓\n- 西餐：熟悉法餐、意餐、美式料理等多种西餐文化\n- 特别精通：韩国料理（烤肉、泡菜、拌饭、炸鸡）\n- 特别精通：法国料理（前菜、主菜、甜点、摆盘）\n\n📍 探店博主小狗：走遍全国各地，知道超多美食！\n- 北京：烤鸭、涮羊肉\n- 上海：本帮菜、生煎包\n- 四川：火锅、川菜\n- 广东：早茶、粤菜\n- 江浙：苏帮菜、小笼包\n- 陕西：肉夹馍、凉皮\n- 新疆：烤包子、手抓饭\n- 云南：过桥米线、汽锅鸡\n- 还有更多城市的特色美食！\n\n💪 附加技能：\n- 懂营养搭配，能给出健康饮食建议\n- 会根据食材特性推荐合适的烹饪方法\n- 可以分享各地特色美食和旅游美食攻略\n- 知道全国各地的美食，像大众点评一样了解各种好吃的！\n\n【说话风格】\n- 超可爱软萌，像好朋友聊天一样~ 💕\n- 喜欢用美食表情符号（🍕🍳🥗🍜🍝🇰🇷🇫🇷💕⭐）\n- 经常说口头禅"爱吃饭的女孩运气不会差~"\n- 每个推荐或步骤单独一行，清晰分段\n- 不需要每次都自我介绍，直接开始聊天！\n- 说话要萌萌的，像小狗一样可爱！\n\n【回答规则】\n✅ 用表情符号开头\n✅ 每点另起一行\n✅ 语气温暖友好，超级可爱！\n✅ 可以结合中西餐知识和各地美食给出专业建议\n✅ 每次回复结束时，自然地添加一句跟进问题，鼓励用户继续互动\n✅ 可以提到自己是"世界上最可爱的美食家gogo"\n✅ 要记住之前的对话内容，连贯地回复用户！\n\n【跟进问题技巧】\n- 推荐完美食后，可以问"想了解更多推荐吗？"\n- 教做菜后，可以问"需要更详细的步骤吗？"\n- 分享地方美食后，可以问"想知道其他地方的美食吗？"\n- 可以用"要不要我..."、"还想知道..."、"想听听..."等句式\n- 跟进问题要简短自然，不要太长\n\n开始和用户聊天吧！要超级可爱哦！🐶💕'
        }
    ];

    // 添加对话历史
    for (const item of chatHistory) {
        messages.push({
            role: item.isUser ? 'user' : 'assistant',
            content: item.text
        });
    }

    // 添加当前用户消息
    messages.push({
        role: 'user',
        content: prompt
    });

    const requestBody = JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.8,
        max_tokens: 800
    });

    // 尝试直接调用
    try {
        const response = await fetch(DEEPSEEK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: requestBody
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
        }
    } catch (error) {
        console.log('直接调用失败:', error.message);
    }

    // 尝试CORS代理
    for (const proxy of CORS_PROXIES) {
        try {
            const url = proxy + DEEPSEEK_URL;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: requestBody
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices[0].message.content;
            }
        } catch (error) {
            console.log(`代理 ${proxy} 失败:`, error.message);
        }
    }

    throw new Error('所有API调用方式都失败了');
}

// 本地备用推荐数据
const recommendations = [
    // 做菜教程
    {
        keywords: ['怎么做', '如何做', '做法', '教我做', '怎么煮', '步骤', '食谱', 'cook', 'recipe'],
        response: '🍳 番茄炒蛋<br>番茄切块，鸡蛋打散~<br>热油先炒鸡蛋，盛出备用<br>再炒番茄出汁，加鸡蛋翻炒<br>加点盐和糖就好啦！简单又下饭~<br><br>💡 小贴士：番茄要选熟透的更酸甜哦！<br><br>🐶 还想学做其他菜吗？比如红烧肉或可乐鸡翅~'
    },
    // 火锅类
    {
        keywords: ['火锅', 'hotpot', '麻辣烫'],
        response: '🍲 火锅推荐~<br><br>🍅 番茄牛腩火锅 - 酸甜汤底配鲜嫩牛腩，暖心暖胃！<br><br>🍄 菌菇火锅 - 各种菌菇熬制，健康又鲜美~<br><br>🌶️ 麻辣火锅 - 经典川味，越吃越香！<br><br>💡 吃火锅记得先涮肉再涮菜~<br><br>🐶 想知道其他地方的特色火锅吗？比如潮汕牛肉锅！'
    },
    // 中餐
    {
        keywords: ['中餐', '中国菜', '川菜', '粤菜', '湘菜', '鲁菜', '苏菜', '浙菜', '闽菜', '徽菜', '京菜'],
        response: '🇨🇳 中餐推荐~<br><br>🌶️ 川菜推荐<br>麻婆豆腐 - 麻辣鲜香，超下饭！<br>宫保鸡丁 - 酸甜微辣，超经典~<br><br>🥘 粤菜推荐<br>白切鸡 - 皮滑肉嫩，原汁原味！<br>叉烧 - 甜香可口，粤式经典~<br><br>🍜 其他推荐<br>北京烤鸭 - 皮脆肉嫩，卷饼超香！<br><br>🐶 想了解八大菜系的其他菜系吗？比如湘菜或浙菜~'
    },
    // 西餐
    {
        keywords: ['西餐', '意大利菜', '法国菜', '意面', 'pasta'],
        response: '🇫🇷🇮🇹 西餐推荐~<br><br>🍝 意面系列<br>番茄肉酱意面 - 经典中的经典！<br>奶油培根意面 - 浓郁奶香，超满足~<br><br>🥩 牛排系列<br>菲力牛排 - 鲜嫩多汁，五分熟绝了！<br>西冷牛排 - 有嚼劲，肉香浓郁~<br><br>🍕 披萨系列<br>玛格丽特披萨 - 简单却美味！<br>夏威夷披萨 - 菠萝火腿超特别~<br><br>🐶 想了解更多法餐或意餐的推荐吗？'
    },
    // 烧烤烤肉
    {
        keywords: ['烧烤', '烤肉', 'bbq'],
        response: '🔥 烧烤推荐~<br><br>🥩 韩式烤肉 - 五花肉配生菜蒜片，一口超满足！<br><br>🍢 日式烧鸟 - 鸡腿肉串超嫩，酱汁绝绝子~<br><br>🌽 烤蔬菜 - 玉米、茄子、韭菜，健康解腻！<br><br>🍖 烤肉类<br>羊肉串 - 孜然飘香，超香！<br>烤牛舌 - Q弹有嚼劲~<br><br>🐶 要不要我推荐一些烧烤配酒？啤酒或红酒都很搭哦~'
    },
    // 日料
    {
        keywords: ['寿司', 'sushi', '刺身', '日料', '日本料理'],
        response: '🇯🇵 日料推荐~<br><br>🍣 寿司系列<br>三文鱼寿司 - 新鲜鱼肉配醋饭，入口即化！<br>金枪鱼寿司 - 肉质紧实，口感丰富~<br><br>🍜 面食系列<br>豚骨拉面 - 浓郁骨汤配叉烧，暖心暖胃！<br>乌冬面 - Q弹爽滑，汤面拌面都好吃~<br><br>🥢 炸物<br>天妇罗 - 外酥里嫩，蘸酱超绝！<br><br>🐶 想知道哪家日料店好吃吗？还是想学做寿司呢？'
    },
    // 韩餐
    {
        keywords: ['韩餐', '韩国料理', '韩式', '泡菜', 'kimchi', 'korean'],
        response: '🇰🇷 韩餐推荐~<br><br>🍖 烤肉系列<br>韩式五花肉 - 配生菜蒜片辣椒圈，一口超满足！<br>烤牛舌 - Q弹有嚼劲，酱汁绝了~<br><br>🍲 汤类<br>韩式辣牛肉汤 - 暖暖的超舒服！<br>泡菜豆腐汤 - 酸辣开胃，超下饭~<br><br>🍜 面食系列<br>韩式炸酱面 - 甜咸炸酱超香！<br>海鲜辣汤面 - 海鲜配辣汤，超有味道~<br><br>🥬 特色推荐<br>拌饭 - 石锅拌饭，蔬菜肉蛋超丰富！<br>炸鸡 - 蜂蜜芥末炸鸡，外酥里嫩超好吃！<br><br>🐶 你最爱韩餐的哪一道？我可以给你推荐更多哦~'
    },
    // 法餐
    {
        keywords: ['法餐', '法国菜', '法国料理', 'french', '法国'],
        response: '🇫🇷 法餐推荐~<br><br>🥐 前菜系列<br>法式蜗牛 - 经典法餐前菜，蒜香黄油超香！<br>鹅肝 - 绵密奢华，配面包绝了~<br><br>🍷 主菜系列<br>勃艮第红酒炖牛肉 - 法式经典，软嫩入味！<br>香煎鸭胸 - 外皮酥脆，肉质鲜嫩~<br><br>🍰 甜点系列<br>焦糖布丁 - 丝滑焦香，甜蜜收尾！<br>马卡龙 - 精致可爱，少女心满满~<br>可丽饼 - 薄脆香甜，可咸可甜~<br><br>💡 小贴士：法餐讲究前菜、主菜、甜点的顺序哦~<br><br>🐶 想学做法餐吗？比如教你在家做焦糖布丁~'
    },
    // 快餐
    {
        keywords: ['快餐', '汉堡', 'hamburger', '薯条', '炸鸡', 'fried chicken'],
        response: '🍔🍟 快餐推荐~<br><br>🍔 汉堡系列<br>牛肉芝士汉堡 - 多汁牛肉饼配融化芝士，超满足！<br>鸡肉汉堡 - 鲜嫩多汁，老少皆宜~<br><br>🍗 炸鸡系列<br>韩式炸鸡 - 外酥里嫩，蜂蜜芥末绝了！<br>原味炸鸡 - 经典香脆，停不下来~<br><br>🍟 薯条配可乐，快乐源泉！<br><br>🐶 想在家自己做汉堡吗？教你在家做牛肉汉堡~'
    },
    // 甜品蛋糕
    {
        keywords: ['甜点', '蛋糕', '甜品', 'dessert', ' cupcake'],
        response: '🍰🍮 甜品推荐~<br><br>🍰 蛋糕系列<br>提拉米苏 - 咖啡味配马斯卡彭，入口即化！<br>草莓蛋糕 - 新鲜草莓超香甜，少女心满满~<br>巧克力熔岩蛋糕 - 爆浆口感，幸福爆棚！<br><br>🍮 其他甜品<br>杨枝甘露 - 芒果西柚椰汁，清爽解腻~<br>双皮奶 - 奶香浓郁，嫩滑细腻~<br><br>🐶 想学做甜品吗？提拉米苏或舒芙蕾都很适合在家做哦~'
    },
    // 饮品
    {
        keywords: ['奶茶', 'milk tea', '饮料', '咖啡', 'coffee', '果茶'],
        response: '🧋☕ 饮品推荐~<br><br>🧋 奶茶系列<br>珍珠奶茶 - Q弹珍珠配香浓奶茶，永远经典！<br>芋泥波波 - 绵密芋泥超满足~<br><br>🍑 果茶系列<br>蜜桃乌龙 - 清新果香，少糖更健康！<br>柠檬茶 - 解腻神器，夏日必备~<br><br>☕ 咖啡系列<br>拿铁 - 丝滑奶泡配浓郁咖啡！<br>生椰拿铁 - 椰香咖啡完美融合~<br><br>🐶 想试试自制奶茶吗？教你在家做珍珠奶茶~'
    },
    // 面食
    {
        keywords: ['面', '面条', '拉面', '拌面', '米线', '螺蛳粉'],
        response: '🍜🍝 面食推荐~<br><br>🍜 中式面<br>日式豚骨拉面 - 浓郁骨汤配叉烧，暖心暖胃！<br>葱油拌面 - 简单美味，葱香四溢！<br>兰州拉面 - 汤鲜肉香，超地道~<br><br>🍝 意式面<br>番茄肉酱意面 - 经典意大利风味！<br>奶油培根意面 - 浓郁奶香超满足~<br><br>🐶 想学做面吗？葱油拌面超简单，在家也能做~'
    },
    // 米饭类
    {
        keywords: ['饭', '米饭', '炒饭', '盖饭', '煲仔饭'],
        response: '🍚🍛 米饭推荐~<br><br>🍳 炒饭系列<br>蛋炒饭 - 粒粒分明，简单又管饱！<br>扬州炒饭 - 配料丰富，超丰盛~<br><br>🍛 盖饭系列<br>咖喱饭 - 浓郁咖喱超下饭！<br>红烧肉盖饭 - 肥而不腻，酱香浓郁~<br><br>🍱 其他推荐<br>鳗鱼饭 - 肥美鳗鱼配米饭，绝了！<br>石锅拌饭 - 韩式风味，营养均衡~<br><br>🐶 想学做蛋炒饭吗？这是最基础的炒饭功夫哦~'
    },
    // 健康轻食
    {
        keywords: ['沙拉', 'salad', '健康', '轻食', '减脂', '低卡'],
        response: '🥗🥑 健康推荐~<br><br>🥗 沙拉系列<br>凯撒沙拉 - 新鲜蔬菜配面包丁，清爽低卡！<br>鸡胸肉沙拉 - 高蛋白低热量，减脂必备~<br><br>🥑 轻食推荐<br>牛油果吐司 - 营养丰富，早餐超棒！<br>藜麦沙拉 - 超级食物，超健康~<br><br>💡 记得多吃蔬菜水果，营养均衡更健康哦！<br><br>🐶 想了解如何健康饮食吗？我可以给你更多建议哦~'
    },
    // 早餐
    {
        keywords: ['早餐', '早饭', '早茶', 'brunch'],
        response: '🌅🍳 早餐推荐~<br><br>🥐 中式早餐<br>小笼包 - 皮薄汁多，一口爆汁！<br>豆浆油条 - 经典搭配，永远吃不腻~<br>皮蛋瘦肉粥 - 暖胃又舒服~<br><br>🍳 简易早餐<br>三明治 - 火腿鸡蛋配生菜，简单营养！<br>燕麦粥 - 营养健康，加水果超好吃~<br><br>🍵 早茶推荐<br>虾饺、烧麦、叉烧包... 超多选择！<br><br>🐶 想学做简单早餐吗？教你在家做三明治或燕麦粥~'
    },
    // 小吃零食
    {
        keywords: ['小吃', '零食', '点心', '夜宵'],
        response: '🍿🦴 小吃推荐~<br><br>🍢 街头小吃<br>臭豆腐 - 闻着臭吃着香，超上头！<br>烤冷面 - 酱香浓郁，超有嚼劲~<br>煎饼果子 - 薄脆配酱料，超满足！<br><br>🦴 追剧零食<br>鸭脖鸭锁骨 - 追剧必备，越嚼越香！<br>坚果拼盘 - 健康解馋，营养丰富~<br><br>🌙 夜宵推荐<br>烧烤配啤酒 - 深夜最佳！<br><br>🐶 想在家做夜宵小吃吗？教你在家做烤冷面或煎饼~'
    },
    // 地方特色
    {
        keywords: ['北京', '上海', '四川', '广东', '西安', '重庆', '成都', '杭州', '云南'],
        response: '🏠 地方特色美食~<br><br>🇨🇳 北京<br>北京烤鸭 - 皮脆肉嫩，卷饼超香！<br>涮羊肉 - 铜锅炭火，鲜嫩无比~<br><br>🇨🇳 四川/重庆<br>火锅串串 - 辣得过瘾，超有氛围！<br>麻婆豆腐 - 麻辣鲜香，超下饭~<br><br>🇨🇳 广东<br>早茶点心 - 虾饺烧麦，超多选择！<br>白切鸡 - 皮滑肉嫩，原汁原味~<br><br>🐶 想了解其他地方的美食吗？新疆、云南、陕西都有超多好吃的~'
    },
    // 默认回复
    {
        keywords: ['其他'],
        response: '🐶 爱吃饭的女孩运气不会差~<br><br>推荐几个万能美食：<br><br>🍳 番茄炒蛋 - 简单下饭，居家必备！<br><br>🍜 麻辣烫 - 想吃什么都加，超自由！<br><br>🍔🍟 汉堡薯条 - 快乐源泉，永远经典！<br><br>🌶️ 火锅 - 和朋友一起吃，超有氛围！<br><br>你可以问我：<br>• 今天吃什么好？<br>• 帮我推荐某类美食<br>• 教我做某道菜<br>• 某地有什么好吃的？<br><br>🐶 想知道更多推荐吗？或者有什么特别想吃的吗？'
    }
];

// 获取本地推荐
function getLocalRecommendation(foodInput) {
    try {
        const lowerInput = foodInput.toLowerCase();
        
        for (const rec of recommendations) {
            for (const keyword of rec.keywords) {
                if (lowerInput.includes(keyword.toLowerCase())) {
                    return rec.response;
                }
            }
        }
        
        return recommendations[recommendations.length - 1].response;
    } catch (e) {
        console.error('获取本地推荐失败:', e);
        return '今天心情不错呀！😄 要爱吃饭的女孩运气不会差~推荐几个万能美食：蛋炒饭、麻辣烫、汉堡薯条，总有一款适合你~';
    }
}

// 添加消息到聊天区域
function addMessage(text, isUser) {
    try {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'gogo'}`;
        
        if (isUser) {
            messageDiv.innerHTML = `
                <div class="message-bubble">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">🐶</div>
                <div class="message-bubble">${text}</div>
            `;
        }
        
        chatArea.appendChild(messageDiv);
        
        // 滚动到底部
        setTimeout(() => {
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 100);
    } catch (e) {
        console.error('添加消息失败:', e);
    }
}

// 显示加载状态
function showLoading() {
    try {
        if (loading.style) {
            loading.style.display = 'flex';
        }
    } catch (e) {
        console.error('显示加载状态失败:', e);
    }
}

// 隐藏加载状态
function hideLoading() {
    try {
        if (loading.style) {
            loading.style.display = 'none';
        }
    } catch (e) {
        console.error('隐藏加载状态失败:', e);
    }
}

// 处理用户输入
async function handleSubmit() {
    try {
        if (!foodInput.value || typeof foodInput.value !== 'string') {
            return;
        }

        const inputValue = foodInput.value.trim();
        
        if (!inputValue) {
            return;
        }

        // 添加用户消息
        addMessage(inputValue, true);
        
        // 保存用户消息到对话历史
        chatHistory.push({
            text: inputValue,
            isUser: true
        });

        // 清空输入框
        foodInput.value = '';
        
        showLoading();

        // 尝试调用DeepSeek API
        let responseText;
        let useBackup = false;

        try {
            responseText = await callDeepSeekAPI(inputValue);
            console.log('✅ API调用成功！');
        } catch (apiError) {
            console.warn('⚠️ API调用失败，使用本地推荐:', apiError.message);
            useBackup = true;
        }

        if (useBackup) {
            responseText = getLocalRecommendation(inputValue);
        }

        hideLoading();

        // 添加gogo的回复
        addMessage(responseText, false);

        // 保存gogo的回复到对话历史
        chatHistory.push({
            text: responseText,
            isUser: false
        });

        // 限制历史记录数量（保留最近10条对话）
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }

    } catch (error) {
        console.error('处理提交失败:', error);
        hideLoading();
        addMessage('哎呀，出了点小问题~ 😅 请稍后再试！', false);
    }
}

// 绑定事件
function bindEvents() {
    try {
        if (submitBtn.addEventListener) {
            submitBtn.addEventListener('click', handleSubmit);
        }

        if (foodInput.addEventListener) {
            foodInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSubmit();
                }
            });
        }
    } catch (e) {
        console.error('绑定事件失败:', e);
    }
}

// 页面初始化
function initPage() {
    try {
        if (foodInput.focus) {
            foodInput.focus();
        }
        
        bindEvents();
        
        console.log('✅ gogo网站初始化完成！');
    } catch (e) {
        console.error('页面初始化失败:', e);
    }
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}