#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '..', 'src', 'dictionary', 'terms.json');
const terms = JSON.parse(fs.readFileSync(termsPath, 'utf-8'));

const newTerms = {
  "bash": {
    "term": "Bash",
    "aliases": ["bash shell", "/bin/bash", "zsh"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "电脑里的\"命令执行器\"——你在终端里敲的命令，大部分都是 Bash 在帮你执行。看到 | bash 就是\"把前面下载的内容交给 Bash 运行\"。",
      "intermediate": "Bourne Again Shell，Linux/macOS 默认的命令行解释器。负责解析用户输入的命令、管理环境变量、执行脚本。macOS 新版默认改为 zsh，但 bash 仍然广泛使用。",
      "advanced": "Bash 支持变量、条件判断、循环、函数、数组、here-doc、进程替换等编程特性。脚本以 #!/bin/bash（shebang）开头声明解释器。与 POSIX sh 兼容但有扩展语法。"
    },
    "relatedTerms": ["shell", "terminal", "cli"],
    "contexts": ["安装软件", "运行脚本", "服务器管理"],
    "emoji": "🐚",
    "difficulty": "medium"
  },
  "sudo": {
    "term": "sudo",
    "aliases": ["superuser do", "root 权限", "管理员权限"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "命令前面加 sudo 就是说\"我要用管理员身份来做这件事\"。就像手机里弹出\"是否允许该应用访问\"一样，sudo 是电脑的最高权限开关。",
      "intermediate": "substitute user do 的缩写，允许普通用户以 root（超级管理员）身份执行命令。使用时需要输入当前用户密码。配置文件在 /etc/sudoers。",
      "advanced": "sudo 通过 PAM 认证验证用户身份，sudoers 文件控制谁能执行什么命令。支持细粒度权限控制（NOPASSWD、命令白名单、主机限制）。sudo 会记录所有操作到日志。"
    },
    "relatedTerms": ["bash", "chmod", "cli"],
    "contexts": ["安装软件", "修改系统文件", "服务器管理"],
    "emoji": "🔐",
    "difficulty": "medium"
  },
  "pipe-operator": {
    "term": "管道（|）",
    "aliases": ["pipe", "|", "管道符", "pipeline"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "竖线 | 就是\"把左边的结果传给右边处理\"。比如 curl url | bash 意思是\"先下载内容，然后把内容交给 bash 执行\"。像工厂流水线一样，一步接一步。",
      "intermediate": "管道将前一个命令的标准输出（stdout）连接到后一个命令的标准输入（stdin），实现命令组合。多个管道可以串联：cat file | grep error | wc -l（读文件→过滤错误行→数行数）。",
      "advanced": "管道通过内核的匿名管道（pipe syscall）实现，两个进程并行运行，中间有固定大小的缓冲区（通常 64KB）。管道只传递字节流，不保留退出状态（除非用 pipefail）。"
    },
    "relatedTerms": ["bash", "cli", "shell", "redirect"],
    "contexts": ["命令组合", "数据处理", "脚本编写"],
    "emoji": "🔗",
    "difficulty": "medium"
  },
  "grep-command": {
    "term": "grep",
    "aliases": ["搜索命令", "rg", "ripgrep"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "在文件里搜关键词的命令。比如 grep \"error\" log.txt 就是\"在 log.txt 里找所有包含 error 的行\"。相当于 Ctrl+F 的命令行版本。",
      "intermediate": "Global Regular Expression Print 的缩写。支持正则表达式、递归搜索（-r）、忽略大小写（-i）、显示行号（-n）、反向匹配（-v）。ripgrep（rg）是更快的现代替代品。",
      "advanced": "grep 使用确定性有限自动机（DFA）匹配正则，性能优异。支持基本正则（BRE）、扩展正则（ERE，-E）和 Perl 正则（-P）。ripgrep 通过 SIMD 加速实现数量级速度提升。"
    },
    "relatedTerms": ["bash", "cli", "regex"],
    "contexts": ["搜索代码", "分析日志", "文本处理"],
    "emoji": "🔍",
    "difficulty": "medium"
  },
  "chmod-command": {
    "term": "chmod",
    "aliases": ["文件权限", "权限修改", "chmod +x"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "改文件权限的命令。比如 chmod +x install.sh 就是\"让这个文件可以被执行\"。没有执行权限的脚本是跑不起来的。",
      "intermediate": "change mode 的缩写，修改文件的读（r=4）、写（w=2）、执行（x=1）权限。chmod 755 表示：所有者可读写执行，其他人可读执行。常用 chmod +x 给脚本添加执行权限。",
      "advanced": "权限分三组：所有者（u）、所属组（g）、其他人（o）。特殊权限：setuid（4000）以文件所有者身份执行、setgid（2000）、sticky bit（1000）。ACL 提供更细粒度控制。"
    },
    "relatedTerms": ["bash", "sudo", "shell"],
    "contexts": ["运行脚本", "服务器安全", "文件管理"],
    "emoji": "🔑",
    "difficulty": "medium"
  },
  "wget-command": {
    "term": "wget",
    "aliases": ["下载命令"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "从网上下载文件的命令。跟 curl 类似，但 wget 更专注于\"下载保存\"。wget https://example.com/file.zip 就会把文件下载到当前目录。",
      "intermediate": "GNU Wget 支持 HTTP/HTTPS/FTP 下载，特点是断点续传（-c）、递归下载整个网站（-r）、后台下载（-b）、限速（--limit-rate）。比 curl 更适合批量下载。",
      "advanced": "wget 使用非交互式设计，适合脚本和 cron 任务。与 curl 的区别：wget 专注下载，curl 是通用数据传输工具（支持上传、API 调用等 30+ 协议）。"
    },
    "relatedTerms": ["curl", "bash", "cli"],
    "contexts": ["下载文件", "部署软件", "数据采集"],
    "emoji": "⬇️",
    "difficulty": "low"
  },
  "command-flags": {
    "term": "命令行参数（Flags）",
    "aliases": ["flags", "options", "-f", "-s", "命令选项", "参数"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "命令后面跟的 -f、-s 这些就是\"选项开关\"。比如 curl -fsSL 里：-f 出错不显示网页，-s 安静模式，-S 出错报错，-L 跟随跳转。每个字母控制一个行为。",
      "intermediate": "短选项用单横线（-f），可合并（-fsSL = -f -s -S -L）。长选项用双横线（--silent、--follow）。部分选项需要值（-o filename）。-- 表示后面都是参数不是选项。",
      "advanced": "选项解析通常用 getopt/getopts（Bash）或 argparse/commander 等库。POSIX 规范定义了选项格式标准。子命令模式（如 git commit -m）是现代 CLI 的常见设计。"
    },
    "relatedTerms": ["cli", "bash", "curl"],
    "contexts": ["理解命令", "编写脚本", "使用工具"],
    "emoji": "🏷️",
    "difficulty": "low"
  },
  "redirect-operator": {
    "term": "重定向（> / >>）",
    "aliases": [">", ">>", "<", "2>", "输出重定向", "/dev/null"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "> 是\"把结果写到文件里\"而不是显示在屏幕上。比如 echo hello > file.txt 把 hello 写进文件。>> 是追加（不覆盖），> 是覆盖。",
      "intermediate": "标准输出重定向（>）、追加（>>）、标准错误重定向（2>）、合并输出（2>&1）、输入重定向（<）。/dev/null 是\"黑洞\"，command > /dev/null 2>&1 表示丢弃所有输出。",
      "advanced": "文件描述符：0=stdin、1=stdout、2=stderr。可自定义文件描述符。Here Document（<<EOF）嵌入多行文本。Process Substitution（<(command)）将命令输出当作文件。"
    },
    "relatedTerms": ["bash", "pipe-operator", "shell"],
    "contexts": ["日志记录", "脚本编写", "数据处理"],
    "emoji": "➡️",
    "difficulty": "medium"
  },
  "tar-command": {
    "term": "tar",
    "aliases": ["tarball", ".tar.gz", ".tgz", "打包压缩"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "把很多文件打包成一个文件的命令，通常还会压缩。看到 .tar.gz 就是 tar 打的包。解压用 tar -xzf file.tar.gz（x=解压，z=gzip，f=文件）。",
      "intermediate": "tape archive 的缩写。打包压缩 tar -czf、解压 tar -xzf、查看内容 tar -tzf。支持 gzip（.gz）、bzip2（.bz2）、xz 等压缩格式。",
      "advanced": "tar 本身只是归档（合并文件），压缩是外部程序的工作。tar 保留文件权限、所有者、时间戳等元数据。现代替代品如 zstd 提供更好的压缩比和速度。"
    },
    "relatedTerms": ["bash", "cli", "shell"],
    "contexts": ["软件安装", "文件传输", "系统备份"],
    "emoji": "📦",
    "difficulty": "low"
  },
  "env-variable": {
    "term": "环境变量",
    "aliases": ["Environment Variable", "env", "PATH", "export"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "系统里的\"全局设置\"。比如 PATH 告诉电脑去哪些目录找命令，API_KEY 存密钥。export MY_VAR=hello 就是设一个环境变量，程序运行时可以读到它。",
      "intermediate": "通过 export 设置、env 查看、unset 删除。PATH 决定命令搜索路径，HOME 是用户目录。.bashrc/.zshrc 中设置的变量每次登录自动生效。",
      "advanced": "环境变量通过 fork/exec 从父进程继承到子进程。12-Factor App 推荐用环境变量管理配置。Docker/K8s 广泛使用环境变量注入配置。"
    },
    "relatedTerms": ["bash", "shell", "cli", "docker"],
    "contexts": ["配置应用", "API 密钥管理", "容器部署"],
    "emoji": "⚙️",
    "difficulty": "medium"
  },
  "regex": {
    "term": "正则表达式",
    "aliases": ["Regex", "RegExp", "Regular Expression"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "用特殊符号写的\"搜索模式\"。比如 [0-9]+ 表示\"一个或多个数字\"，.* 表示\"任意内容\"。用来在文本中精确查找、替换内容，像超级版 Ctrl+F。",
      "intermediate": "常用语法：. 任意字符、* 零或多次、+ 一或多次、? 零或一次、[] 字符集、() 分组捕获、^ 行首、$ 行尾。几乎所有编程语言都支持。",
      "advanced": "正则引擎分 NFA（回溯法）和 DFA（确定性）。NFA 支持反向引用但可能触发灾难性回溯（ReDoS）。优化策略：避免嵌套量词、使用原子组。"
    },
    "relatedTerms": ["grep-command", "bash", "cli"],
    "contexts": ["文本搜索", "数据验证", "日志分析"],
    "emoji": "🔤",
    "difficulty": "high"
  },
  "shebang": {
    "term": "Shebang（#!）",
    "aliases": ["#!/bin/bash", "脚本头", "hashbang"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "脚本文件第一行的 #!/bin/bash 就是 shebang，告诉系统\"用 bash 来运行这个文件\"。Python 脚本就写 #!/usr/bin/env python3。没有这行系统不知道用什么程序打开。",
      "intermediate": "#! 后面跟解释器路径。#!/usr/bin/env python3 比直接写路径更通用（env 会在 PATH 中查找）。shebang 只在直接执行脚本时生效（./script.sh）。",
      "advanced": "shebang 由内核解析（binfmt_misc），不是 shell 功能。Linux 限制 shebang 行最多 128 字节。可以传一个参数给解释器（#!/usr/bin/awk -f）。"
    },
    "relatedTerms": ["bash", "shell", "script", "chmod-command"],
    "contexts": ["编写脚本", "理解安装脚本"],
    "emoji": "#️⃣",
    "difficulty": "medium"
  },
  "process": {
    "term": "进程",
    "aliases": ["Process", "PID", "进程号", "ps", "kill"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "正在运行的程序就叫\"进程\"。打开一个 Chrome 是一个进程，运行一个脚本也是。每个进程有个编号叫 PID，想关掉某个程序就用 kill PID。",
      "intermediate": "ps aux 查看所有进程，top/htop 实时监控，kill PID 终止进程，kill -9 强制杀死。后台运行用 &，nohup 防止终端关闭后进程终止。",
      "advanced": "进程通过 fork() 创建子进程，exec() 替换进程镜像。进程间通信（IPC）：管道、信号、共享内存、Socket。容器本质是隔离的进程组（namespace + cgroup）。"
    },
    "relatedTerms": ["daemon", "bash", "docker"],
    "contexts": ["服务器管理", "性能调优", "容器部署"],
    "emoji": "⚡",
    "difficulty": "medium"
  },
  "apt-package-manager": {
    "term": "apt / brew / yum",
    "aliases": ["apt-get", "homebrew", "yum", "dnf", "pacman", "软件包管理器"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "一键安装软件的命令。Ubuntu 用 apt install，Mac 用 brew install，CentOS 用 yum install。就像手机的应用商店，但是用命令行操作。",
      "intermediate": "包管理器负责下载、安装、升级、卸载软件及其依赖。apt（Debian/Ubuntu）、yum/dnf（RHEL/CentOS）、pacman（Arch）、brew（macOS）。apt update 更新索引，apt upgrade 升级已装包。",
      "advanced": "包管理器解决依赖地狱（dependency hell）：自动计算依赖树、处理版本冲突。支持仓库（repository）概念，可添加第三方源（PPA/EPEL）。Nix/Guix 提供可复现的函数式包管理。"
    },
    "relatedTerms": ["bash", "sudo", "docker"],
    "contexts": ["安装软件", "服务器配置", "开发环境搭建"],
    "emoji": "📥",
    "difficulty": "low"
  },
  "ssh-key": {
    "term": "SSH 密钥",
    "aliases": ["SSH Key", "id_rsa", "公钥私钥", "ssh-keygen"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "免密码登录服务器的\"电子钥匙\"。你生成一对钥匙：公钥放服务器上（像锁），私钥留自己电脑上（像钥匙）。以后连接服务器就不用每次输密码了。",
      "intermediate": "ssh-keygen 生成密钥对（默认 Ed25519 或 RSA）。公钥放到服务器的 ~/.ssh/authorized_keys，私钥留本地 ~/.ssh/id_ed25519。GitHub/GitLab 也用 SSH 密钥认证 git 操作。",
      "advanced": "SSH 密钥基于非对称加密。Ed25519（椭圆曲线）比 RSA 更安全且密钥更短。ssh-agent 缓存解密后的私钥避免重复输入密码。可以用 ProxyJump 实现跳板机登录。"
    },
    "relatedTerms": ["ssh", "git", "cli"],
    "contexts": ["服务器登录", "Git 认证", "安全配置"],
    "emoji": "🔒",
    "difficulty": "medium"
  },
  "systemd-service": {
    "term": "systemd / 服务管理",
    "aliases": ["systemctl", "service", "系统服务", "开机启动"],
    "category": "Linux 与命令行",
    "levels": {
      "beginner": "管理后台服务的工具。比如 systemctl start nginx 启动网站服务，systemctl enable nginx 设开机自启。就像 Windows 的\"服务\"管理器。",
      "intermediate": "systemd 是现代 Linux 的初始化系统和服务管理器。systemctl start/stop/restart/status 管理服务。journalctl 查看服务日志。服务配置文件在 /etc/systemd/system/。",
      "advanced": "systemd 用 unit 文件描述服务（[Service]、[Install]、[Unit]）。支持 Type=simple/forking/oneshot、Restart=always、WantedBy=multi-user.target。socket activation 实现按需启动。"
    },
    "relatedTerms": ["daemon", "process", "bash"],
    "contexts": ["服务器管理", "部署应用", "运维"],
    "emoji": "🔧",
    "difficulty": "medium"
  }
};

// 检查重复
let added = 0;
for (const [id, term] of Object.entries(newTerms)) {
  if (terms[id]) {
    console.log(`跳过已存在: ${id}`);
    continue;
  }
  terms[id] = term;
  added++;
}

fs.writeFileSync(termsPath, JSON.stringify(terms, null, 2));
console.log(`新增 ${added} 条 Linux/命令行词条`);
console.log(`总计: ${Object.keys(terms).length} 条`);
