document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    M.Modal.init(document.querySelectorAll('.modal'));
    
    const generateBtn = document.getElementById('generateBtn');
    const summarySection = document.getElementById('summarySection');
    const summaryContent = document.getElementById('summaryContent');
    const summaryTimestamp = document.getElementById('summaryTimestamp');
    const loadingModal = M.Modal.getInstance(document.getElementById('loadingModal'));
    
    generateBtn.addEventListener('click', async function() {
        try {
            loadingModal.open();
            
            const response = await fetch('/generate_summary', {
                method: 'POST'
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                summaryContent.textContent = data.summary;
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