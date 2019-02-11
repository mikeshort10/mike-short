function win () {
    if (this.state.playerHP > 0 && this.state.boss.HP > 0) return;
    let boss = { ...this.state.boss };
    let status;
    if (this.state.playerHP <= 0) {
      status = "lose...";
      for (let key in this.state.timers) clearInterval(this.state.timers[key]);
      if (boss.timer) clearInterval(boss.timer);
    } else if (boss.HP <= 0) {
      status = "win!";
      for (let key in this.state.timers) clearInterval(this.state.timers[key]);
      clearInterval(boss.timer);
    }
    this.setState({
      status: status || this.state.status
    });
  }

export default win;