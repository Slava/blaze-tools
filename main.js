chrome.devtools.panels.create(
  "Blaze tools",
  "icon128.png",
  "panel.html",
  function (panel) {
  }
);

function getBlazeTmplInstForSelection () {
  if (! window.Blaze)
    return {};

  try { Blaze.getView($0) } catch (err) {
    return {};
  }

  var info = {
    viewInst: Blaze.getView($0),
    data: Blaze.getData($0),
    template: null,
    view: null
  };

  for (var v = info.viewInst; !!v; v = v.parentView) {
    var m = v.name.match(/^Template\.(.*)/);
    if (!info.template && m && m[1]) {
      info.template = m[1];
    }
    if (!info.view && !m) {
      info.view = v.name;
    }

    if (info.view && info.template)
      break;
  }

  return info;
}

chrome.devtools.panels.elements.createSidebarPane("Blaze", function (sidebar) {
  function updateSidebar () {
    sidebar.setExpression("(" + getBlazeTmplInstForSelection.toString() + ")()");
  }
  // TODO: make this reactive
  chrome.devtools.panels.elements.onSelectionChanged.addListener(updateSidebar);

  updateSidebar();
});

