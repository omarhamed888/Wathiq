
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Return only the base64 part, without the data URI prefix
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const simpleMarkdownToHtml = (text: string = ''): string => {
  // Pre-process text to handle common non-standard markdown from AI.
  // This helps break up walls of text and format sections correctly.
  const processedText = text
    // 1. Treat '###' as a separator for new sections/paragraphs.
    .replace(/\s*###\s*/g, '\n\n');

  return processedText
    .split('\n\n') // Split into paragraphs/blocks
    .map(block => block.trim())
    .filter(block => block.length > 0)
    .map(block => {
      // Standard Markdown Headers
      if (block.startsWith('# ')) return `<h1>${block.substring(2)}</h1>`;
      if (block.startsWith('## ')) return `<h2>${block.substring(3)}</h2>`;
      if (block.startsWith('### ')) return `<h3>${block.substring(4)}</h3>`;

      // Unordered lists
      if (block.match(/^[\*-] /m)) {
        const items = block.split('\n').map(item => `<li>${item.replace(/^[\*-] /, '').trim()}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      
      // Heuristic for identifying headers that aren't formatted with '#'.
      // A short line is likely a title.
      const wordCount = block.split(/\s+/).length;
      if (wordCount > 0 && wordCount < 10) {
        // Ends with punctuation common for titles.
        if (block.endsWith('?') || block.endsWith('!')) {
            return `<h3>${block}</h3>`;
        }
      }

      // Paragraph
      // Replace single newlines within a block with <br> for line breaks.
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('')
    // Inline replacements (bold, italics)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics
};