// Auto Project Organizer 2.0 - ExtendScript (ES3)
var APO = (function () {
    var categories = ['Comps', 'Images', 'Videos', 'Audios'];
    var colors = ['None','Red','Yellow','Aqua','Pink','Lavender','Peach','Sea Foam','Blue','Green','Purple','Orange','Brown','Fuchsia','Cyan','Sandstone','Dark Green'];
    var names = categories.slice(0), labels = [15,5,3,13];
    function trim(s) { return String(s).replace(/^\s+|\s+$/g, ''); }
    function project() { if (!app.project) throw Error('Open a project first.'); return app.project; }
    function findFolder(p, name) {
        for (var i=1; i<=p.numItems; i++) {
            var item=p.item(i);
            if (item instanceof FolderItem && item.parentFolder === p.rootFolder && item.name === name) return item;
        }
        return null;
    }
    function undo(title, fn) {
        app.beginUndoGroup(title);
        try { return fn(); } finally { app.endUndoGroup(); }
    }
    function folders(p) {
        var result=[];
        for(var i=0;i<4;i++) {
            var f=findFolder(p,names[i]) || p.items.addFolder(names[i]);
            f.label=labels[i]; result.push(f);
        }
        return result;
    }
    function classify(item) {
        if(item instanceof CompItem) return 0;
        if(!(item instanceof FootageItem) || !item.file) return -1;
        var match=/\.([^.]+)$/.exec(item.file.name.toLowerCase());
        var ext=match ? match[1] : '';
        if (/^(wav|mp3|aif|aiff|aac|m4a|flac|ogg|wma)$/.test(ext) || (item.hasAudio && !item.hasVideo)) return 3;
        if (/^(png|jpg|jpeg|gif|psd|psb|tif|tiff|exr|dpx|bmp|tga|webp|heic|heif|ai|eps|svg|ico)$/.test(ext)) return item.mainSource.isStill ? 1 : 2;
        if (/^(mp4|mov|avi|mkv|mxf|m4v|webm|mpg|mpeg|mts|m2ts|wmv|r3d|braw)$/.test(ext)) return 2;
        if(item.hasVideo) return item.mainSource.isStill ? 1 : 2;
        return -1;
    }
    function setup() { var p=project(); return undo('Setup Organizer Folders',function(){folders(p);return 'Folders ready.';}); }
    function organize() {
        var p=project();
        return undo('Organize Project',function(){
            var targets=folders(p), items=[], moved=0, skipped=0, unchanged=0;
            for(var i=1;i<=p.numItems;i++) if(!(p.item(i) instanceof FolderItem)) items.push(p.item(i));
            for(var j=0;j<items.length;j++) {
                var item=items[j], k=classify(item);
                if(k<0){skipped++;continue;}
                if(item.parentFolder===targets[k] && item.label===labels[k]) {unchanged++;continue;}
                item.parentFolder=targets[k]; item.label=labels[k]; moved++;
            }
            return 'Organized: '+moved+' | Already organized: '+unchanged+' | Skipped: '+skipped;
        });
    }
    function update(newNames,newLabels) {
        var p=project(), old=[], i,j;
        for(i=0;i<4;i++) {
            newNames[i]=trim(newNames[i]);
            if(!newNames[i]) throw Error('Folder names cannot be empty.');
            for(j=0;j<i;j++) if(newNames[i].toLowerCase()===newNames[j].toLowerCase()) throw Error('Folder names must be unique.');
            old.push(findFolder(p,names[i]));
        }
        // Reject collisions with other root folders, including another category's current name.
        for(i=0;i<4;i++) for(j=1;j<=p.numItems;j++) {
            var f=p.item(j);
            if(f instanceof FolderItem && f.parentFolder===p.rootFolder && f!==old[i] && f.name.toLowerCase()===newNames[i].toLowerCase()) throw Error('Folder already exists: '+newNames[i]);
        }
        undo('Organizer Settings',function(){
            for(i=0;i<4;i++) if(old[i]) {old[i].name=newNames[i];old[i].label=newLabels[i];}
        });
        names=newNames.slice(0);labels=newLabels.slice(0);
    }
    function settings() {
        var dlg=new Window('dialog','Organizer Settings'); dlg.alignChildren=['fill','top'];
        var rows=[];
        for(var i=0;i<4;i++) {
            var g=dlg.add('group'); var caption=g.add('statictext',undefined,categories[i]);caption.preferredSize.width=65;
            var field=g.add('edittext',undefined,names[i]);field.characters=16;
            var dd=g.add('dropdownlist',undefined,colors);dd.selection=labels[i];
            rows.push([field,dd]);
        }
        var note=dlg.add('statictext',undefined,'Colors follow your After Effects label preferences.');
        var buttons=dlg.add('group');var ok=buttons.add('button',undefined,'OK');buttons.add('button',undefined,'Cancel',{name:'cancel'});
        ok.onClick=function(){try{var n=[],l=[];for(var j=0;j<4;j++){n.push(rows[j][0].text);l.push(rows[j][1].selection.index);}update(n,l);dlg.close(1);}catch(e){alert(e.toString());}};
        return dlg.show()===1 ? 'Settings updated.' : 'Settings canceled.';
    }
    function run(action) {
        try {
            if(action==='setup') return setup();
            if(action==='organize') return organize();
            if(action==='settings') return settings();
            throw Error('Unknown action.');
        } catch(e) { return 'Error: '+e.toString()+' (Use Undo if changes were made.)'; }
    }
    return {run:run, classify:classify, update:update};
})();
