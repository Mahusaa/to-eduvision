import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Processes HTML and renders LaTeX math expressions using KaTeX.
 *
 * @param {string} html - The input HTML string containing LaTeX expressions.
 * @returns {string} - The updated HTML string with rendered LaTeX.
 */
export const processMathInHtml = (html: string): string => {
  if (!html) return html;

  // Replace block math `$$...$$`
  html = html.replace(/\$\$(.+?)\$\$/gs, (_, latex: string) => {
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode: true });
    } catch (error) {
      console.error('KaTeX rendering error (block):', error);
      return `$$${latex}$$`; // Return the raw LaTeX as fallback
    }
  });

  // Replace inline math `$...$`
  html = html.replace(/\$(.+?)\$/g, (_, latex: string) => {
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode: false });
    } catch (error) {
      console.error('KaTeX rendering error (inline):', error);
      return `$${latex}$`; // Return the raw LaTeX as fallback
    }
  });

  return html;
};

