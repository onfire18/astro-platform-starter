import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { visit } from 'unist-util-visit';

/**
 * Umschließt Markdown-Tabellen mit einem horizontal scrollbaren Bereich.
 * Nötig, weil eine dreispaltige Tabelle im Blog 476px breit wird und damit
 * auf einem 390px-Screen aus dem Layout ragt. Der Wrapper ist fokussierbar
 * und als Region benannt — eine scrollbare Fläche muss auch per Tastatur
 * erreichbar sein (WCAG 2.1.1). Die Tabelle selbst bleibt unangetastet,
 * ihre Semantik also erhalten (display:block auf <table> würde sie brechen).
 */
function rehypeScrollbareTabellen() {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            if (node.tagName !== 'table' || !parent || index === null) return;
            if (parent.type === 'element' && parent.properties?.className?.includes?.('table-scroll')) return;
            parent.children[index] = {
                type: 'element',
                tagName: 'div',
                properties: {
                    className: ['table-scroll'],
                    tabindex: '0',
                    role: 'region',
                    'aria-label': 'Tabelle, horizontal scrollbar'
                },
                children: [node]
            };
        });
    };
}

// https://astro.build/config
export default defineConfig({
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false
        })
    ],
    markdown: {
        rehypePlugins: [rehypeScrollbareTabellen]
    },
    output: 'hybrid',
    adapter: netlify()
});
