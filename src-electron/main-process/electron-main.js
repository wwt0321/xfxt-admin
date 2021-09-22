import { app, BrowserWindow, nativeTheme, Menu, shell } from 'electron';

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', function() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu); // 设置菜单部分
  createWindow();
});
app.on('browser-window-created', function() {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = false;
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * 注册键盘快捷键
 * 其中：label: '切换开发者工具',这个可以在发布时注释掉
 */
let template = [
  {
    label: '操作',
    submenu: [
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: '重新加载',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            // on reload, start fresh and close any old
            // open secondary windows
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function(win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        },
      },
    ],
  },
  {
    label: '窗口 ',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        label: '开发者工具',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
      {
        type: 'separator',
      },
    ],
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: '意见反馈',
        click: function() {
          shell.openExternal('https://forum.iptchain.net');
        },
      },
    ],
  },
];

/**
 * 增加更新相关的菜单选项
 */
function addUpdateMenuItems(items, position) {
  if (process.mas) return;

  const version = app.getVersion();
  let updateItems = [
    {
      label: `版本 ${version}`,
      enabled: false,
    },
    {
      label: '检查更新',
      enabled: false,
      key: 'checkingForUpdate',
    },
    {
      label: '检查更新',
      visible: false,
      key: 'checkForUpdate',
      click: function() {
        require('electron').autoUpdater.checkForUpdates();
      },
    },
    {
      label: '重启并安装更新',
      enabled: true,
      visible: false,
      key: 'restartToUpdate',
      click: function() {
        require('electron').autoUpdater.quitAndInstall();
      },
    },
  ];

  items.splice.apply(items, [position, 0].concat(updateItems));
}

function findReopenMenuItem() {
  const menu = Menu.getApplicationMenu();
  if (!menu) return;

  let reopenMenuItem;
  menu.items.forEach(function(item) {
    if (item.submenu) {
      item.submenu.items.forEach(function(item) {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item;
        }
      });
    }
  });
  return reopenMenuItem;
}

// 针对Mac端的一些配置
if (process.platform === 'darwin') {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: '退出',
        accelerator: 'Command+Q',
        click: function() {
          app.quit();
        },
      },
    ],
  });

  // Window menu.
  template[3].submenu.push(
    {
      type: 'separator',
    },
    {
      label: 'Bring All to Front',
      role: 'front',
    },
  );

  addUpdateMenuItems(template[0].submenu, 1);
}

// 针对Windows端的一些配置
if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu;
  addUpdateMenuItems(helpMenu, 0);
}
