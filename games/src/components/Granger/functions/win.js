export default function win () {
  const { boss, player } = this.state;
  if (player.HP < 1 || boss.HP < 1) {
    if (boss.timer) clearInterval(boss.timer);
    this.setState({ status: (player.HP < 1) ? "lose..." : "win!" });
  } 
}