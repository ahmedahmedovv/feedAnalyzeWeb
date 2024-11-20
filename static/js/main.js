document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    M.Modal.init(document.querySelectorAll('.modal'));
    
    const generateBtn = document.getElementById('generateBtn');
    const summarySection = document.getElementById('summarySection');
    const summaryContent = document.getElementById('summaryContent');
    const summaryTimestamp = document.getElementById('summaryTimestamp');
    const loadingModal = M.Modal.getInstance(document.getElementById('loadingModal'));
    
    function makeLinksClickable(text) {
        // First, convert URLs in square brackets to clickable links
        text = text.replace(/\[(https?:\/\/[^\]]+)\]/g, function(match, url) {
            return `[<a href="${url}" target="_blank" class="blue-text text-darken-2">${url}</a>]`;
        });
        
        // Then, format the titles with the news-title class
        text = text.replace(/(Title:\s*)(.*?)(\nSummary:)/g, function(match, prefix, title, suffix) {
            return `${prefix}<span class="news-title">${title}</span>${suffix}`;
        });
        
        return text;
    }
    
    generateBtn.addEventListener('click', async function() {
        try {
            loadingModal.open();
            
            const response = await fetch('/generate_summary', {
                method: 'POST'
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Convert links and preserve line breaks
                const formattedSummary = makeLinksClickable(data.summary)
                    .replace(/\n/g, '<br>');
                summaryContent.innerHTML = formattedSummary;
                summaryTimestamp.textContent = data.timestamp;
                summarySection.style.display = 'block';
                M.toast({html: 'Summary generated successfully!', classes: 'green'});
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            M.toast({html: 'Error generating summary: ' + error.message, classes: 'red'});
        } finally {
            loadingModal.close();
        }
    });
}); 