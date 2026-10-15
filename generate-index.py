#!/usr/bin/env python3
"""
Generate Skills Index for Eli-Mira Portfolio
Outputs a JSON file with all categorized skills + auto-detection triggers
"""
import json
from pathlib import Path

SKILLS_DIR = Path.home() / "AppData" / "Local" / "hermes" / "skills"

CATEGORIES = {
    "autonomous-ai-agents": {
        "name": "AI Agents & Orchestration",
        "triggers": ["agent", "multi-agent", "orchestrate", "delegate", "subagent", "prime", "codex", "opencode", "claude-code"],
        "skills": ["hermes-agent", "hermes-config", "multi-model-orchestration", "claude-code", "codex", "opencode", "computer-use", "dev-squad"]
    },
    "software-development": {
        "name": "Software Development",
        "triggers": ["code", "review", "commit", "pr", "branch", "debug", "test", "tdd", "refactor", "simplify", "security", "antislop", "ponytail", "github", "git", "deploy", "docker", "fastapi", "python"],
        "skills": [
            "github", "simplify-code", "requesting-code-review", "test-driven-development",
            "systematic-debugging", "codebase-inspection", "karpathy-guidelines",
            "slopmonster", "antislop", "antislop-code", "antislop-ui", "ponytail",
            "i-have-adhd", "python-desktop-app-scaffold", "windows-python-app-release",
            "full-output-enforcement", "verification-before-completion",
            "fastapi", "fastapi-templates", "supabase-postgres-best-practices",
            "prisma-cli", "prisma-orm-setup", "api-design-principles",
            "performance", "webapp-testing", "dogfood", "spike",
            "writing-plans", "grilling", "interview-me", "idea-refine",
            "spec-driven-development", "source-driven-development",
            "subagent-driven-development", "project-full-refactor",
            "anti-koshary", "ifixai", "improve-codebase-architecture"
        ]
    },
    "security": {
        "name": "Security & Privacy",
        "triggers": ["security", "audit", "vulnerability", "sast", "penetration", "exploit", "xss", "sqli", "csrf", "secret", "scan", "skillspector", "strix"],
        "skills": ["security-review", "offensive-xss", "offensive-sqli", "strix-security-testing", "security-guardian", "implementing-secret-scanning-with-gitleaks"]
    },
    "ui": {
        "name": "UI & Design",
        "triggers": ["design", "ui", "ux", "color", "layout", "typography", "glass", "theme", "motion", "animation", "accessibility", "wireframe", "figma"],
        "skills": [
            "antislop-ui", "glass-dark-ui", "glassmorphism", "pyside6-theme-overhaul",
            "better-ui", "better-colors", "better-typography", "better-layout",
            "better-interface", "better-accessibility", "frontend-design",
            "design-system", "design-taste-frontend", "high-end-visual-design",
            "minimalist-ui", "industrial-brutalist-ui", "popular-web-designs",
            "wineframe", "architecture-diagram", "excalidraw", "image-to-code",
            "glassmorphism", "liquid-metal-border", "gsap", "lenis-smooth-scroll",
            "cinematic-gsap-lenis-motion-system", "cinematic-scroll-storytelling",
            "threejs", "webgl-3d-object", "cobejs", "vantajs", "matterjs",
            "react-best-practices", "react-state-management", "optimize-web-animations",
            "transitions-dev", "native-app-reference-patterns", "redesign-existing-projects",
            "hearths-pos-ui", "design-critique", "design-tokens", "theme-factory",
            "aria-icons", "better-writing"
        ]
    },
    "creative": {
        "name": "Creative & Content",
        "triggers": ["write", "copy", "humanize", "post", "blog", "email", "social", "video", "image", "music", "art", "present", "ppt", "slide", "design"],
        "skills": [
            "humanizer", "slopmonster", "antislop-copywriting",
            "agentbuff-presentation", "pptx", "pptagent",
            "ai-song-production", "songwriting-and-ai-music",
            "ascii-art", "ascii-video", "baoyu-infographic",
            "img2threejs", "manim-video", "p5js",
            "brag-slim", "claude-design", "design-md",
            "release-announcement", "linkedin-post-writer",
            "linkedin-content-planner", "linkedin-hook-extractor",
            "linkedin-humanizer", "linkedin-reply-handler",
            "linkedin-repurposer", "linkedin-profile-optimizer",
            "linkedin-engager-analytics", "linkedin-thread-monitor",
            "linkedin-comment-drafter", "linkedin-marketing"
        ]
    },
    "productivity": {
        "name": "Productivity & Workflow",
        "triggers": ["notion", "obsidian", "document", "word", "excel", "spreadsheet", "task", "todo", "note", "calendar", "email", "meeting"],
        "skills": [
            "notion", "obsidian", "obsidian-memory-manager",
            "docx", "xlsx", "powerpoint", "pdf",
            "document-to-action-items", "meeting-action-items",
            "weekly-review-planning", "dry-run-planning",
            "google-workspace", "google-drive-access-setup",
            "convert-documents-to-markdown"
        ]
    },
    "communication": {
        "name": "Communication",
        "triggers": ["adhd", "focus", "write", "prose", "voice", "tone", "conversation", "time", "continuity"],
        "skills": ["i-have-adhd", "adaptive-conversation", "one-three-one-rule", "release-announcement", "time-aware-continuity"]
    },
    "data-science": {
        "name": "Data Science & Research",
        "triggers": ["data", "ml", "ai", "research", "paper", "arxiv", "analyze", "stat", "jupyter", "notebook", "meta", "systematic"],
        "skills": ["jupyter-notebook", "analyze-stats", "arxiv", "evidence-level-ranker", "grounded-citations",
                    "make-figures", "meta-analysis-methods-generator", "meta-results-risk-of-bias",
                    "meta-results-sensitivity-analysis", "meta-screening-fulltext",
                    "meta-manuscript-generator", "meta-funnel-plot",
                    "check-reporting", "verify-refs", "systematic-review", "orchestrate", "meta-abstract-screener"]
    },
    "business": {
        "name": "Business & Freelance",
        "triggers": ["pricing", "lead", "freelance", "client", "marketing", "linkedin", "upwork", "khamsat", "mostaql"],
        "skills": ["lead-scout", "pricing-strategy", "linkedin-marketing", "linkedin-skills/*"]
    },
    "devops": {
        "name": "DevOps & Infrastructure",
        "triggers": ["deploy", "docker", "aws", "cloudflare", "vercel", "action", "ci", "cd", "monitor", "sentry", "wrangler"],
        "skills": ["deploy-to-vercel", "docker-management", "github-actions-templates", "multi-stage-dockerfile",
                    "sentry-sdk-setup", "wrangler", "freellmapi", "ollama-gpu-management", "watchers"]
    },
    "social-media": {
        "name": "Social Media",
        "triggers": ["linkedin", "twitter", "reddit", "instagram", "youtube", "social", "post", "engage"],
        "skills": ["linkedin-marketing", "reddit-reading", "instagram-reader", "youtube-content", "social-media-extraction"]
    },
    "elilain-tracker": {
        "name": "EliLain Intel",
        "triggers": ["intel", "track", "eli", "lain", "session", "log"],
        "skills": ["elilain-intel"]
    }
}

def build_index():
    index = {"categories": {}, "flat": []}
    for cat_key, cat_data in CATEGORIES.items():
        skills_list = []
        for skill_name in cat_data["skills"]:
            if "*" in skill_name:
                # Handle wildcard matches
                prefix = skill_name.replace("*", "")
                skills_list.append({"name": skill_name, "category": cat_key, "triggers": cat_data["triggers"]})
            else:
                skills_list.append({"name": skill_name, "category": cat_key, "triggers": cat_data["triggers"]})
        index["categories"][cat_key] = {
            "name": cat_data["name"],
            "triggers": cat_data["triggers"],
            "skills": skills_list
        }
        index["flat"].extend(skills_list)
    return index

if __name__ == "__main__":
    idx = build_index()
    out = Path(__file__).parent / "skills-index.json"
    out.write_text(json.dumps(idx, indent=2))
    print(f"Wrote {len(idx['flat'])} skills to {out}")
