import fs from "fs/promises";
import path from 'path';

// Tạo đường dẫn
const FILE_PATH = path.resolve('task.json');

async function readTasks() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        // lỗi không tìm thấy thư mục
        if (error.code == "ENOENT") {
            return [];
        }
        throw error;
    }
}

async function writeTasks(tasks) {
    await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

async function main() {
    const [, , command, ...args] = process.argv;
    if (!command) {
        console.log("Vui lòng nhập yêu cầu (add, update, delete,...)");
        return;
    }

    const tasks = await readTasks();

    switch (command) {

        case 'add': {
            const description = args.join(' ');
            if (!description) {
                console.log('Lỗi!!!. Thiếu nội dung công việc');
                break;
            }

            else {
                let newId = 1;

                if (tasks.length > 0) {
                    const ids = tasks.map(t => t.id);
                    const maxId = Math.max(...ids);
                    newId = maxId + 1; // Đã sửa: tăng ID lên 1
                }

                const newTask = {
                    id: newId,
                    description,
                    status: 'todo',
                    createdAt: new Date().toISOString(), // Đã sửa: thêm ()
                    updatedAt: new Date().toISOString()  // Đã sửa: thêm ()
                }

                tasks.push(newTask);
                await writeTasks(tasks);
                console.log(`Thêm công việc thành công (ID: ${newId})`);
                break
            }
        }

        case 'update': {
            const id = parseInt(args[0]);
            const description = args.slice(1).join(' ');
            if (isNaN(id) || !description) {
                console.log(`!!!Lỗi cú pháp hoặc nội dung bị trống`);
                break;
            }

            let task = null; // Đã sửa: dùng let thay vì const
            for (const t of tasks) {
                if (t.id === id) {
                    task = t;
                    break;
                }
            }

            if (!task) {
                console.log('!!!Lỗi. Không tìm thấy task');
                break;
            }

            task.description = description; // Đã sửa: sửa desciption thành description
            task.updatedAt = new Date().toISOString(); // Đã sửa: thêm () và đổi updateAt thành updatedAt
            await writeTasks(tasks);
            console.log(`Cập nhật task ${id} thành công`);
            break;
        }

        case 'delete': {
            const id = parseInt(args[0]);
            if (isNaN(id)) {
                console.log('!!! Lỗi. Id phải là một số');
                break;
            }

            const initialLength = tasks.length;
            const updatedTasks = tasks.filter(t => t.id !== id);

            if (initialLength === updatedTasks.length) {
                console.log(`!!! Không tìm thấy task ID ${id}`);
                break;
            }
            await writeTasks(updatedTasks); // Đã sửa: thêm await
            console.log(`Đã xóa thành công task ${id}`);
            break;
        }

        case 'mark-in-progress':
        case 'mark-done': {
            const id = parseInt(args[0]);

            if (isNaN(id)) {
                console.log('!!! Lỗi. Id phải là một số');
                break;
            }

            const task = tasks.find(t => t.id === id);

            if (!task) {
                console.log(`Không tìm thấy task có id ${id}`);
                break;
            }

            task.status = command === 'mark-done' ? 'done' : 'in-progress';
            task.updatedAt = new Date().toISOString(); // Đã sửa: thêm ()
            await writeTasks(tasks);
            console.log(`Cập nhật trạng thái task ${id} thành công`);
            break;
        }

        case 'list': {
            if (!args.length) {
                if (tasks.length === 0) {
                    console.log('Danh sách task trống');
                    break;
                }
                for (const t of tasks) {
                    printTask(t);
                }
                break;
            }

            switch (args[0]) {
                case 'todo': {
                    const todoTasks = tasks.filter(t => t.status === 'todo');
                    if (todoTasks.length === 0) { // Đã sửa: kiểm tra độ dài mảng
                        console.log('Không có task nào có status todo');
                        break;
                    }

                    for (const t of todoTasks) {
                        printTask(t);
                    }
                    break;
                }

                case 'in-progress': {
                    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
                    if (inProgressTasks.length === 0) { // Đã sửa: kiểm tra độ dài mảng
                        console.log('Không có task nào có status in-progress');
                        break;
                    }

                    for (const t of inProgressTasks) {
                        printTask(t);
                    }
                    break;
                }

                case 'done': {
                    const doneTasks = tasks.filter(t => t.status === 'done');
                    if (doneTasks.length === 0) { // Đã sửa: kiểm tra độ dài mảng
                        console.log('Không có task nào có status done');
                        break;
                    }

                    for (const t of doneTasks) {
                        printTask(t);
                    }
                    break;
                }

                default: {
                    console.log('Trạng thái không hợp lệ. Chọn: todo, in-progress, hoặc done');
                }
            }
        }
    }
}

async function printTask(task) {
    console.log(`id: ${task.id}`);
    console.log(`description: ${task.desciption}`);
    console.log(`status: ${task.status}`);
    console.log(`createdAt: ${task.createdAt}`);
    console.log(`updatedAt: ${task.updatedAt}`);
    console.log('------------------------------------------------------------');
}

main()