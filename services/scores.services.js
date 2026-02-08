import { getDB } from "../config/connect.js";

export async function getScores() {
  const db = await getDB();
  const [scores] = await db.query("SELECT * FROM scores");
  return scores;
}

export async function getScoreByMemberId(member_id) {
  const db = await getDB();
  const [scores] = await db.query("SELECT * FROM scores WHERE member_id = ?", [
    member_id,
  ]);
  return scores[0] || null;
}

export async function createScore(data) {
  const db = await getDB();

  const { member_id, score } = data;

  const [result] = await db.execute(
    "INSERT INTO scores (member_id, score) VALUES (?, ?)",
    [member_id, score],
  );

  return {
    member_id,
    score,
  };
}

export async function updateScore(member_id, data) {
  const db = await getDB();

  const { score } = data;

  const [result] = await db.execute(
    "UPDATE scores SET score = ? WHERE member_id = ?",
    [score, member_id],
  );

  return result;
}

export async function deleteScore(member_id) {
  const db = await getDB();
  const [result] = await db.execute("DELETE FROM scores WHERE member_id = ?", [
    member_id,
  ]);
  return result.affectedRows;
}
