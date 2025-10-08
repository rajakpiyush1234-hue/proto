const { exec } = require('child_process');

function findAndKillPort(port) {
  const isWindows = process.platform === 'win32';
  const command = isWindows
    ? `netstat -ano | findstr :${port}`
    : `lsof -i :${port}`;

  console.log(`Checking port ${port}...`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`No process found using port ${port}`);
      return;
    }

    if (stdout) {
      console.log(`Found process using port ${port}:`);
      console.log(stdout);

      if (isWindows) {
        // Extract PID from Windows netstat output
        const lines = stdout.split('\n');
        const pidMatch = lines[0].match(/\s+(\d+)\s*$/);
        if (pidMatch && pidMatch[1]) {
          const pid = pidMatch[1];
          exec(`taskkill /F /PID ${pid}`, (err, out, stderr) => {
            if (err) {
              console.error(`Failed to kill process: ${err.message}`);
            } else {
              console.log(`Successfully killed process ${pid}`);
            }
          });
        }
      } else {
        // Extract PID from Unix lsof output
        const pidMatch = stdout.match(/\s+(\d+)\s+/);
        if (pidMatch && pidMatch[1]) {
          const pid = pidMatch[1];
          exec(`kill -9 ${pid}`, (err, out, stderr) => {
            if (err) {
              console.error(`Failed to kill process: ${err.message}`);
            } else {
              console.log(`Successfully killed process ${pid}`);
            }
          });
        }
      }
    }
  });
}

findAndKillPort(5000);