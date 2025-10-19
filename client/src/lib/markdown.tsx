export function formatMarkdown(text: string): JSX.Element[] {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    
    // Empty line - add spacing
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-lg font-semibold mt-4 mb-2">
          {formatInlineMarkdown(line.substring(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold mt-4 mb-2">
          {formatInlineMarkdown(line.substring(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold mt-4 mb-2">
          {formatInlineMarkdown(line.substring(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Check for bullet list
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const listItems: JSX.Element[] = [];
      let listKey = 0;
      
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        const content = lines[i].trim().substring(2);
        listItems.push(
          <li key={listKey++} className="mb-1">
            {formatInlineMarkdown(content)}
          </li>
        );
        i++;
      }
      
      elements.push(
        <ul key={key++} className="list-disc list-inside mb-3 space-y-1 ml-4">
          {listItems}
        </ul>
      );
      continue;
    }

    // Check for numbered list
    const numberedMatch = line.trim().match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      const listItems: JSX.Element[] = [];
      let listKey = 0;
      
      while (i < lines.length) {
        const match = lines[i].trim().match(/^(\d+)\.\s+(.+)$/);
        if (!match) break;
        
        listItems.push(
          <li key={listKey++} className="mb-1">
            {formatInlineMarkdown(match[2])}
          </li>
        );
        i++;
      }
      
      elements.push(
        <ol key={key++} className="list-decimal list-inside mb-3 space-y-1 ml-4">
          {listItems}
        </ol>
      );
      continue;
    }

    // Regular paragraph with inline formatting
    elements.push(
      <p key={key++} className="mb-3">
        {formatInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return elements;
}

function formatInlineMarkdown(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let currentText = text;
  let key = 0;

  // Bold text - **text** or __text__
  const boldRegex = /(\*\*|__)(.*?)\1/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(currentText)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(currentText.substring(lastIndex, match.index));
    }
    
    // Add bold text
    parts.push(
      <strong key={`bold-${key++}`} className="font-semibold text-foreground">
        {match[2]}
      </strong>
    );
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < currentText.length) {
    parts.push(currentText.substring(lastIndex));
  }

  // If no formatting was found, return the original text
  if (parts.length === 0) {
    return [text];
  }

  return parts;
}
