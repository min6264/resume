/**
 * 个人简历网站 V2 - 交互逻辑
 */
document.addEventListener('DOMContentLoaded', function () {

    // ==================== 左侧导航栏 ====================
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.section');

    // 导航分组映射：section id → 导航 group
    const sectionNavMap = {
        'hero': 'hero',
        'proj1a': 'projects',
        'proj1b': 'projects',
        'proj1c': 'projects',
        'proj2': 'projects',
        'proj3': 'projects',
        'honors': 'honors',
        'dev': 'dev'
    };

    /**
     * 更新导航高亮
     */
    function updateActiveNav(groupName) {
        sidebarLinks.forEach(function (link) {
            var linkGroup = link.getAttribute('data-group');
            if (linkGroup === groupName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * 基于当前视口判断所属导航分组
     */
    function getCurrentNavGroup() {
        var viewportTop = window.scrollY;
        var viewportHeight = window.innerHeight;
        var viewportCenter = viewportTop + viewportHeight / 2;

        var bestGroup = 'hero';
        var bestDistance = Infinity;

        sections.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            var sectionTop = rect.top + window.scrollY;
            var sectionBottom = sectionTop + rect.height;
            var sectionCenter = sectionTop + rect.height / 2;

            var distance = Math.abs(sectionCenter - viewportCenter);

            // 检查section是否在视口中占比较大
            var visibleTop = Math.max(sectionTop, viewportTop);
            var visibleBottom = Math.min(sectionBottom, viewportTop + viewportHeight);
            var visibleHeight = Math.max(0, visibleBottom - visibleTop);
            var visibleRatio = visibleHeight / Math.min(rect.height, viewportHeight);

            if (visibleRatio > 0.25 && distance < bestDistance) {
                bestDistance = distance;
                var sectionId = section.getAttribute('id');
                bestGroup = sectionNavMap[sectionId] || 'hero';
            }
        });

        return bestGroup;
    }

    // 滚动监听（防抖）
    var scrollTimer;
    window.addEventListener('scroll', function () {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
            updateActiveNav(getCurrentNavGroup());
        }, 80);
    }, { passive: true });

    // 点击导航链接
    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 初始高亮 ---
    updateActiveNav('hero');

    // ==================== 证书 Lightbox ====================
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxClose = document.querySelector('.lightbox-close');
    var certificateItems = document.querySelectorAll('.certificate-item');

    certificateItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var img = this.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });

    // ==================== 入场动画 (IntersectionObserver) ====================
    var fadeTargets = document.querySelectorAll(
        '.dual-image-item, .dual-image-desc, .process-step, .result-img-card, .result-block, ' +
        '.project-detail, .award-item, .certificate-item, .dev-card, .process-question'
    );

    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // 错开动画延迟
                var allTargets = Array.from(fadeTargets);
                var index = allTargets.indexOf(entry.target);
                var delay = Math.min(index % 6, 5) * 70;

                setTimeout(function () {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);

                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    fadeTargets.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
        fadeObserver.observe(el);
    });

    // 标题入场动画
    var titleTargets = document.querySelectorAll('.section-title, .project-label, .hero-name');
    var titleObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    titleTargets.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-24px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        titleObserver.observe(el);
    });

    // ==================== 箭头动画重置 ====================
    // 当流程箭头重新进入视口时重启动画
    var arrows = document.querySelectorAll('.process-arrow');
    var arrowObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                entry.target.offsetHeight; // 触发reflow
                entry.target.style.animation = 'pulse-arrow 2s ease-in-out infinite';
            }
        });
    }, { threshold: 0.5 });

    arrows.forEach(function (arrow) {
        arrowObserver.observe(arrow);
    });
});
