(function () {
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function roundedRectPath(ctx, x, y, w, h, r) {
        const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
    }

    function drawGlassPanel(ctx, options) {
        const {
            x,
            y,
            w,
            h,
            radius = 22,
            fill = 'rgba(6,10,26,0.72)',
            stroke = 'rgba(150,195,255,0.28)',
            shadow = 'rgba(30,90,180,0.18)'
        } = options;

        ctx.save();
        ctx.shadowColor = shadow;
        ctx.shadowBlur = 18;
        roundedRectPath(ctx, x, y, w, h, radius);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = stroke;
        ctx.stroke();
        ctx.restore();
    }

    function drawPanelTitle(ctx, text, x, y, options) {
        const opts = options || {};
        ctx.save();
        ctx.textAlign = opts.align || 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = opts.color || '#ffffff';
        ctx.font = opts.font || 'bold 28px "PingFang SC","Microsoft YaHei",sans-serif';
        if (opts.glow) {
            ctx.shadowColor = opts.glow;
            ctx.shadowBlur = opts.glowBlur || 18;
        }
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    function wrapText(ctx, text, maxWidth) {
        const paragraphs = String(text || '').split('\n');
        const lines = [];
        for (const paragraph of paragraphs) {
            if (!paragraph) {
                lines.push('');
                continue;
            }
            let current = '';
            for (const character of paragraph) {
                const next = current + character;
                if (ctx.measureText(next).width > maxWidth && current) {
                    lines.push(current);
                    current = character;
                } else {
                    current = next;
                }
            }
            if (current) lines.push(current);
        }
        return lines;
    }

    function drawParagraphBlock(ctx, options) {
        const {
            text,
            x,
            y,
            maxWidth,
            lineHeight = 26,
            color = 'rgba(240,246,255,0.88)',
            font = '16px "PingFang SC","Microsoft YaHei",sans-serif',
            align = 'left'
        } = options;

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = 'top';
        const lines = wrapText(ctx, text, maxWidth);
        let cursorY = y;
        for (const line of lines) {
            if (!line) {
                cursorY += lineHeight;
                continue;
            }
            ctx.fillText(line, x, cursorY);
            cursorY += lineHeight;
        }
        ctx.restore();
        return cursorY;
    }

    function pointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    }

    function drawButton(ctx, button, hovered) {
        const radius = button.radius || 18;
        const alpha = hovered ? 1 : 0.88;
        const topColor = hovered ? (button.topHover || '#5aa7ff') : (button.top || '#396fd8');
        const bottomColor = hovered ? (button.bottomHover || '#285dd0') : (button.bottom || '#20479e');
        const gradient = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.h);
        gradient.addColorStop(0, topColor);
        gradient.addColorStop(1, bottomColor);

        ctx.save();
        ctx.globalAlpha = alpha;
        roundedRectPath(ctx, button.x, button.y, button.w, button.h, radius);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = hovered ? 2.4 : 1.4;
        ctx.strokeStyle = hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)';
        ctx.stroke();

        if (hovered) {
            ctx.shadowColor = 'rgba(120,190,255,0.4)';
            ctx.shadowBlur = 14;
            roundedRectPath(ctx, button.x, button.y, button.w, button.h, radius);
            ctx.strokeStyle = 'rgba(180,230,255,0.28)';
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = button.font || 'bold 18px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2 + 1);

        if (button.caption) {
            ctx.fillStyle = 'rgba(255,255,255,0.68)';
            ctx.font = '12px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillText(button.caption, button.x + button.w / 2, button.y + button.h + 18);
        }

        ctx.restore();
    }

    function drawInfoChip(ctx, chip) {
        const paddingX = chip.paddingX || 14;
        const paddingY = chip.paddingY || 8;
        ctx.save();
        ctx.font = chip.font || 'bold 13px "PingFang SC","Microsoft YaHei",sans-serif';
        const textWidth = ctx.measureText(chip.text).width;
        const width = textWidth + paddingX * 2;
        const height = (chip.height || 30);
        drawGlassPanel(ctx, {
            x: chip.x,
            y: chip.y,
            w: width,
            h: height,
            radius: height / 2,
            fill: chip.fill || 'rgba(16,24,48,0.82)',
            stroke: chip.stroke || 'rgba(164,210,255,0.25)',
            shadow: 'rgba(0,0,0,0)'
        });
        ctx.fillStyle = chip.color || '#e8f4ff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(chip.text, chip.x + width / 2, chip.y + height / 2 + 1);
        ctx.restore();
        return { x: chip.x, y: chip.y, w: width, h: height };
    }

    function drawDivider(ctx, x, y, w, color) {
        ctx.save();
        const gradient = ctx.createLinearGradient(x, y, x + w, y);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.5, color || 'rgba(160,210,255,0.25)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.stroke();
        ctx.restore();
    }

    function drawProgressBar(ctx, options) {
        const progress = clamp(options.progress, 0, 1);
        const x = options.x;
        const y = options.y;
        const w = options.w;
        const h = options.h || 16;
        ctx.save();
        roundedRectPath(ctx, x, y, w, h, h / 2);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fill();
        if (progress > 0) {
            const gradient = ctx.createLinearGradient(x, y, x + w, y);
            gradient.addColorStop(0, options.colorStart || '#6ab8ff');
            gradient.addColorStop(1, options.colorEnd || '#9a7dff');
            roundedRectPath(ctx, x, y, Math.max(h, w * progress), h, h / 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        roundedRectPath(ctx, x, y, w, h, h / 2);
        ctx.stroke();
        ctx.restore();
    }

    window.StarHunterUI = {
        clamp,
        drawGlassPanel,
        drawPanelTitle,
        wrapText,
        drawParagraphBlock,
        drawButton,
        drawInfoChip,
        drawDivider,
        drawProgressBar,
        pointInRect
    };
})();
