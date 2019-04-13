export default function win () {
  const { boss, player } = this.state;
  if (player.HP < 1 || boss.HP < 1) {
    for (let key in this.timers) clearInterval(this.timers[key]);
    if (boss.timer) clearInterval(boss.timer);
    this.setState({ status: (player.HP < 1) ? "lose..." : "win!" });
  } 
}