document.addEventListener('DOMContentLoaded', function() {
    const rssForm = document.getElementById('rssForm');
    const rssLinks = document.getElementById('rssLinks');

    // Load current RSS links
    fetch('/api/rss-links')
        .then(response => response.json())
        .then(data => {
            rssLinks.value = data.links.join('\n');
            M.textareaAutoResize(rssLinks);
            M.updateTextFields();
        })
        .catch(error => {
            M.toast({html: 'Error loading RSS links: ' + error.message, classes: 'red'});
        });

    // Handle form submission
    rssForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/rss-links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    links: rssLinks.value.split('\n').filter(link => link.trim())
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                M.toast({html: 'RSS links saved successfully!', classes: 'green'});
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            M.toast({html: 'Error saving RSS links: ' + error.message, classes: 'red'});
        }
    });
}); 