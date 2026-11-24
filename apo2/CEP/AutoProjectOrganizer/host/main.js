(function () {
    'use strict';
    var status = document.getElementById('status');
    var actions = ['setup', 'organize', 'settings'];
    function run(action) {
        if (!window.__adobe_cep__) { status.textContent = 'Open this panel inside After Effects.'; return; }
        status.textContent = 'Working...';
        actions.forEach(function(id){document.getElementById(id).disabled=true;});
        try {
            // CEP's native bridge; no external CSInterface.js dependency needed.
            window.__adobe_cep__.evalScript('APO.run("' + action + '")', function(result) {
                status.textContent = result && result !== 'EvalScript error.' ? result : 'No result from After Effects. Check the project and Undo history.';
                actions.forEach(function(id){document.getElementById(id).disabled=false;});
            });
        } catch(e) {
            status.textContent = String(e);
            actions.forEach(function(id){document.getElementById(id).disabled=false;});
        }
    }
    actions.forEach(function(action){document.getElementById(action).addEventListener('click',function(){run(action);});});
})();
