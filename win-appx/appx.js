const { spawnSync } = require('child_process');
const fse = require('fs-extra');
const path = require('path');
const rcedit = require('rcedit');

process.on('unhandledRejection', (error) => {
    throw error;
});

const rceditAsync = (...args) => new Promise((resolve, reject) => {
    rcedit(...args, (error) => error == null ? resolve(): reject(error));
});
const system = (command, args) => spawnSync('cmd', ['/c', command, ...args], { stdio: 'inherit' });

const deskgapPath = "C:\\Users\\patr0nus\\repo\\Pym\\node_modules\\deskgap\\dist\\DeskGap";
const appPath = "C:\\Users\\patr0nus\\repo\\Pym\\app";

const workingFolder = "C:\\Users\\patr0nus\\repo\\Pym\\release\\build";

const executableIcon = "C:\\Users\\patr0nus\\repo\\Pym\\release\\pym.ico";
const resources = "C:\\Users\\patr0nus\\repo\\Pym\\release\\resources";
const appxmanifest = "C:\\Users\\patr0nus\\repo\\Pym\\release\\appxmanifest.xml";
// const appxmanifest = "C:\\Users\\patr0nus\\repo\\Pym\\release\\appxmanifest_selfsigning.xml";
const signingPFX = null;//"C:\\Users\\patr0nus\\repo\\Pym\\release\\AppxTestRootAgency.pfx";

let executableName = null;
try {
    const packageJSON = require(path.join(appPath, 'package.json'));
    executableName = packageJSON.productName || packageJSON.name;
}
catch (e) { }

(async () => {
    await fse.remove(workingFolder);
    await fse.mkdirp(workingFolder);
    process.chdir(workingFolder);

    await fse.copy(deskgapPath, executableName);

    await fse.copy(resources, path.join(executableName, 'resources'));
    await fse.copy(appxmanifest, path.join(executableName, 'appxmanifest.xml'));

    {
        const targetAppPath = path.join(executableName, 'resources', 'app');
        await fse.remove(targetAppPath);
        await fse.copy(appPath, targetAppPath);
    }

    {
        const executablePath = path.join(executableName, `${executableName}.exe`);
        await fse.rename(path.join(executableName, 'DeskGap.exe'), executablePath);
        await rceditAsync(executablePath, { icon: executableIcon });
    }
    
    {
        const appxFile = executableName + '.appx';
        system('makeappx', ['pack', '/d', executableName, '/p', appxFile]);
        if (signingPFX != null) {
            system('signtool', ['sign', '/fd', 'sha256', '/f', signingPFX, appxFile]);
        }
    }

})();
