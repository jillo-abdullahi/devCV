import { useState, useRef, useEffect } from 'react';
import type { ResumeData, TemplateId } from '@/types/resume';
import { useTemplateFont } from '@/hooks/useTemplateFont';
import { getTemplate } from '../../../shared/templates';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MultiPagePreviewProps {
  resumeData: ResumeData;
  templateId: TemplateId;
  onPagesChange?: (pages: string[]) => void;
}

const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
const PADDING_MM = 15; // Top/Bottom padding from TemplateMinimalist

export const MultiPagePreview: React.FC<MultiPagePreviewProps> = ({
  resumeData,
  templateId,
  onPagesChange,
}) => {
  const { fontFamily, isLoading } = useTemplateFont(templateId);
  const Template = getTemplate(templateId);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const sourceRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [resumeData, templateId]);

  useEffect(() => {
    if (!sourceRef.current || isLoading) return;

    // Small delay to ensure rendering is complete and styles applied
    const timer = setTimeout(() => {
      if (!sourceRef.current) return;

      // Dynamically calculate mm to px conversion to match browser's rendering
      const div = document.createElement('div');
      div.style.width = '100mm';
      div.style.height = '100mm';
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      document.body.appendChild(div);
      let mmToPx = div.getBoundingClientRect().height / 100;
      document.body.removeChild(div);

      // Sanity check for mmToPx (should be around 3.78 for 96 DPI)
      if (!mmToPx || mmToPx < 2 || mmToPx > 6) {
        console.warn('Invalid mmToPx calculation, falling back to standard 3.78');
        mmToPx = 3.7795275591;
      }

      const pageHeightPx = A4_HEIGHT_MM * mmToPx;
      const paddingPx = PADDING_MM * mmToPx;
      const contentHeightPx = pageHeightPx - (paddingPx * 2) - 150; // 150px safety buffer

      const newPages: string[] = [];
      let currentContent = '';
      let currentHeight = 0;

      const flushPage = () => {
        if (currentContent) {
          newPages.push(currentContent);
          currentContent = '';
          currentHeight = 0;
        }
      };

      const addToPage = (html: string, height: number) => {
        currentContent += html;
        currentHeight += height;
      };

      // Helper to process a node
      const processNode = (node: Element) => {
        const nodeHeight = node.getBoundingClientRect().height;
        const style = window.getComputedStyle(node);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const totalHeight = nodeHeight + marginTop + marginBottom;

        // If node fits on current page
        if (currentHeight + totalHeight <= contentHeightPx) {
          addToPage(node.outerHTML, totalHeight);
        } else {
          // Node doesn't fit. 
          // Check if it's a section that we can split
          if (node.classList.contains('section')) {
            // It's a section, let's try to split it
            const title = node.querySelector('.section-title');
            const items = Array.from(node.children).filter(c => c !== title);

            // Start the section on current page
            const styleAttr = node.getAttribute('style') ? ` style="${node.getAttribute('style')}"` : '';
            let sectionHtml = `<div class="${node.className}"${styleAttr}>`;
            let sectionHeight = marginTop; // Start with margin top

            // Add title if it exists
            if (title) {
              const titleHeight = title.getBoundingClientRect().height +
                (parseFloat(window.getComputedStyle(title).marginBottom) || 0);

              // If title doesn't fit, flush page first
              if (currentHeight + sectionHeight + titleHeight > contentHeightPx) {
                if (currentHeight > 0) {
                  flushPage();
                  // Retry processing this node on new page
                  processNode(node);
                  return;
                }
              }

              sectionHtml += title.outerHTML;
              sectionHeight += titleHeight;
            }

            // Process items
            let itemsProcessed = 0;
            for (const item of items) {
              const itemHeight = item.getBoundingClientRect().height +
                (parseFloat(window.getComputedStyle(item).marginBottom) || 0);

              // Check if item fits, including the section's bottom margin if this were the last item
              // We conservatively add the section margin to the check to ensure we don't overflow
              if (currentHeight + sectionHeight + itemHeight + marginBottom <= contentHeightPx) {
                sectionHtml += item.outerHTML;
                sectionHeight += itemHeight;
                itemsProcessed++;
              } else {
                // Item doesn't fit.
                // Close current section and flush page
                sectionHtml += '</div>';
                // Add the section height PLUS its margin bottom to the page
                addToPage(sectionHtml, sectionHeight + marginBottom);
                flushPage();

                // Start new page and new section
                sectionHtml = `<div class="${node.className}"${styleAttr}>`;
                sectionHeight = marginTop; // Reset height for new page section

                // Add item to new page
                sectionHtml += item.outerHTML;
                sectionHeight += itemHeight;
                itemsProcessed++;
              }
            }

            // Close the final section fragment
            sectionHtml += '</div>';
            addToPage(sectionHtml, sectionHeight + marginBottom);

          } else {
            // Not a splittable section (e.g. Header or Summary)
            // If it doesn't fit, move to next page
            if (currentHeight > 0) {
              flushPage();
              // Add to new page
              addToPage(node.outerHTML, totalHeight);
            } else {
              // It's taller than a single page and can't be split? 
              // Just add it and let it clip/overflow (best effort)
              addToPage(node.outerHTML, totalHeight);
            }
          }
        }
      };

      // Iterate through top-level children
      const previewContent = sourceRef.current.querySelector('.resume-preview');
      if (previewContent) {
        const contentNodes = Array.from(previewContent.children);
        for (const node of contentNodes) {
          processNode(node);
        }
      }

      flushPage();
      setPages(newPages);
      onPagesChange?.(newPages);

    }, 100);

    return () => clearTimeout(timer);
  }, [resumeData, fontFamily, isLoading]);

  const goToNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Loading template...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Hidden Source for Measurement */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: `${A4_WIDTH_MM}mm`,
          visibility: 'hidden'
        }}
      >
        <div ref={sourceRef}>
          <Template
            resumeData={resumeData}
            mode="client"
            fontFamily={fontFamily}
          />
        </div>
      </div>

      {/* Navigation */}
      {pages.length > 1 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pages.length}
            </span>
            <div className="flex gap-1">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-2 h-2 rounded-full transition-colors ${i + 1 === currentPage
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === pages.length}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Page Display */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <div className="max-w-[210mm] mx-auto space-y-8">
          {pages.map((pageHtml, index) => (
            <div
              key={index}
              className={`bg-white shadow-xl mx-auto relative transition-opacity duration-300 overflow-hidden ${
                // Show all pages or just current? 
                // User asked for "Multi-page preview". Usually implies scrolling through all.
                // But we have navigation buttons. 
                // The previous implementation showed all.
                // Let's show all, but scroll to current?
                // Or just show one at a time if we have nav buttons?
                // The nav buttons suggest a carousel.
                // Let's stick to carousel for now as it's cleaner, or show all if user wants.
                // The previous code had "All pages stacked vertically" comment but also nav buttons.
                // Let's show ALL pages, but highlight/scroll to current.
                // Actually, if we show all pages, we don't strictly need next/prev buttons unless they scroll.
                // Let's just render all of them.
                ''
                }`}
              style={{
                width: `${A4_WIDTH_MM}mm`,
                height: `${A4_HEIGHT_MM}mm`,
                // Hide pages that are not current if we want pagination mode
                display: pages.length > 1 && index + 1 !== currentPage ? 'none' : 'block'
              }}
            >
              {/* Page Content */}
              <div className="h-full w-full">
                {/* We need to inject the styles from the template too? 
                     The styles are in the document head from the hidden render.
                     So we just need the content structure.
                     TemplateMinimalist applies styles to .resume-preview.
                     So we need to wrap our content in .resume-preview.
                 */}
                <div
                  className="resume-preview h-full"
                  dangerouslySetInnerHTML={{ __html: pageHtml }}
                />
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 right-4 text-gray-400 text-xs">
                {index + 1} / {pages.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
