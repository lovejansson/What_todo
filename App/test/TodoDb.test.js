import TodoDb from "../data/TodoDb";

const sqlite3 = require("sqlite3").verbose();

let sqlite3Db;
let todoDb;

const txMock = {
  executeSql: jest.fn(
    (
      query,
      params = [],
      successCallback = () => {},
      errorCallback = () => {}
    ) => {
      const selectRegex = /select|SELECT/;
      const insertRegex = /insert|INSERT/;
      const updateRegex = /update|UPDATE/;
      const deleteRegex = /delete|DELETE/;

      if (selectRegex.exec(query) === null) {
        sqlite3Db.run(query, params, function callback(error) {
          if (error) {
            errorCallback(txMock, error);
          } else {
            const resultSet = {
              insertId: insertRegex.exec(query) ? this.lastID : null,
              rowsAffected:
                deleteRegex.exec(query) || updateRegex.exec(query)
                  ? this.changes
                  : 0,
              rows: {
                length: 0,
                items: (idx) => {
                  null;
                },
                _array: null,
              },
            };
            successCallback(txMock, resultSet);
          }
        });
      } else {
        sqlite3Db.all(query, params, (error, rows) => {
          if (error) {
            errorCallback(txMock, error);
          } else {
            const resultSet = {
              insertId: null,
              rowsAffected: 0,
              rows: {
                length: rows.length,
                item: (idx) => {
                  if (rows.length > 0) {
                    return rows[idx];
                  } else {
                    return null;
                  }
                },
                _array: rows,
              },
            };
            successCallback(txMock, resultSet);
          }
        });
      }
    }
  ),
};

const expoSqliteMock = {
  transaction: jest.fn((callback) => {
    callback(txMock);
  }),
};

async function createInMemoryDb() {
  return new Promise((resolve, reject) => {
    sqlite3Db = new sqlite3.Database(":memory:", (error, open) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

async function insertAfewTasks() {
  await todoDb.insertTask(1, "task1");
  await todoDb.insertTask(1, "task2");
  await todoDb.insertTask(1, "task3");
}

async function insertAfewLists() {
  await todoDb.insertList("list1", "icon1");
  await todoDb.insertList("list2", "icon2");
}

beforeAll(async () => {
  todoDb = new TodoDb(expoSqliteMock);
  await createInMemoryDb();
  await todoDb.createTasksTable();
  await todoDb.createListsTable();
  await insertAfewTasks();
  await insertAfewLists();
});

afterAll((done) => {
  sqlite3Db.close((error) => {
    if (error) {
      done(error);
    } else {
      done();
    }
  });
});

test("insert task4", (done) => {
  todoDb
    .insertTask(1, "task4")
    .then((res) => {
      expect(res).toBe(4);
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("get task4", (done) => {
  todoDb
    .getTask(4)
    .then((res) => {
      expect(res.description).toBe("task4");
      expect(res.listId).toBe(1);
      expect(res.done).toBe(0); // false
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("update task4", (done) => {
  todoDb
    .updateTask(4, "new description")
    .then((res) => {
      expect(res).toBe(1);
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("delete task4", (done) => {
  // delete
  todoDb
    .deleteTask(4)
    .then((res) => {
      expect(res).toBe(1);
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("get list1", (done) => {
  todoDb
    .getList(1)
    .then((res) => {
      expect(res.name).toBe("list1");
      expect(res.icon).toBe("icon1");
      expect(res.id).toBe(1);
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("get tasks in list 1", (done) => {
  todoDb
    .getTasksInList(1)
    .then((res) => {
      expect(res.length).toBe(3);
      expect(res[0].description).toBe("task1");
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("get tasks in list 2 -> empty", (done) => {
  todoDb
    .getTasksInList(2)
    .then((res) => {
      expect(res.length).toBe(0);

      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("insert list3", (done) => {
  todoDb
    .insertList("list3", "icon3")
    .then((res) => {
      expect(res).toBe(3);
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("update list3 - id missing", () => {
  let res = todoDb.updateList({ name: "new name", icon: "new icon" });
  return expect(res).rejects.toBe("missing params");
});

test("update list3 - name and icon missing", () => {
  let res = todoDb.updateList({ id: 3 });
  return expect(res).rejects.toBe("missing params");
});

test("update list3 - only name", async () => {
  let res = await todoDb.updateList({ id: 3, name: "new name" });
  expect(res).toBe(1);

  let updated = await new Promise((resolve, reject) => {
    sqlite3Db.get("select * from lists where id = ?", [3], (error, row) => {
      if (error) {
        reject();
      } else {
        resolve(row);
      }
    });
  });

  expect(updated.name).toBe("new name");
});

test("update list3 - only icon", async () => {
  let res = await todoDb.updateList({ id: 3, icon: "new icon" });
  expect(res).toBe(1);

  let updated = await new Promise((resolve, reject) => {
    sqlite3Db.get("select * from lists where id = ?", [3], (error, row) => {
      if (error) {
        reject();
      } else {
        resolve(row);
      }
    });
  });

  expect(updated.name).toBe("new name");
  expect(updated.icon).toBe("new icon");
});

test("update list3 - both", async () => {
  let res = await todoDb.updateList({
    id: 3,
    name: "new name 2",
    icon: "new icon 2",
  });
  expect(res).toBe(1);

  let updated = await new Promise((resolve, reject) => {
    sqlite3Db.get("select * from lists where id = ?", [3], (error, row) => {
      if (error) {
        reject();
      } else {
        resolve(row);
      }
    });
  });

  expect(updated.name).toBe("new name 2");
  expect(updated.icon).toBe("new icon 2");
});

test("delete list1", async () => {
  let res = await todoDb.deleteList(1);
  expect(res.deletedLists).toBe(1);
  expect(res.deletedTasks).toBe(3);

  let deletedList = await new Promise((resolve, reject) => {
    sqlite3Db.get("select * from lists where id = ?", [1], (error, row) => {
      if (error) {
        reject();
      } else {
        resolve(row);
      }
    });
  });

  let deletedTasks = await new Promise((resolve, reject) => {
    sqlite3Db.all("select * from tasks where listId = ?", [1], (error, row) => {
      if (error) {
        reject();
      } else {
        resolve(row);
      }
    });
  });

  expect(deletedList).toBe(undefined);
  expect(deletedTasks.length).toBe(0);
});
