// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DocifyTabView } from './docify-tab.view'

vi.mock('../../webview/mermaid-renderer', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
        render: vi.fn(),
        initializePanZoom: vi.fn(),
        destroyAllPanZoom: vi.fn(),
        }
    }),
}))

vi.mock('../../webview/diagram-controls', () => ({
    DiagramControls: vi.fn().mockImplementation(function () {
        return {
        createControls: vi.fn(),
        destroy: vi.fn(),
        }
    }),
}))

vi.mock('../../webview/diagram-export-control', () => ({
    DiagramExportControl: vi.fn().mockImplementation(function () {
        return {
        createControl: vi.fn(),
        destroy: vi.fn(),
        }
    }),
}))

vi.mock('../../webview/diagram-export', () => ({
    exportDiagram: vi.fn(),
}))

type DocifyResult = { content: string; format: 'html' | 'markdown'; sourceFile: string }

function createViewModelStub() {
    return {
        onDocifyResult: vi.fn((_handler: (result: DocifyResult) => void) => undefined),
        onDocifyError: vi.fn((_handler: (error: string) => void) => undefined),
    }
}

describe('DocifyTabView.extractNodeIdFromMermaidElement', () => {
    let container: HTMLElement
    let view: DocifyTabView

    beforeEach(() => {
        container = document.createElement('div')
        view = new DocifyTabView(
            createViewModelStub() as any,
            container,
            { postMessage: vi.fn() } as any,
        )
    })

    it('extracts the node ID from the current Mermaid flowchart element format', () => {
        const result = (view as any).extractNodeIdFromMermaidElement('mermaid-abc123-flowchart-conference-website-7')
        expect(result).toBe('conference-website')
    })

    it('preserves hyphenated node IDs', () => {
        const result = (view as any).extractNodeIdFromMermaidElement('mermaid-diagram42-flowchart-payments-api-gateway')
        expect(result).toBe('payments-api-gateway')
    })

    it('strips the Mermaid reserved-word escape prefix when present', () => {
        const result = (view as any).extractNodeIdFromMermaidElement('mermaid-xyz789-flowchart-node_end-user-3')
        expect(result).toBe('end-user')
    })

    it('returns null when the element ID does not match the expected Mermaid node format', () => {
        const result = (view as any).extractNodeIdFromMermaidElement('flowchart-conference-website-7')
        expect(result).toBeNull()
    })
})
