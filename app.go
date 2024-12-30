package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/faiface/beep"
	"github.com/faiface/beep/mp3"
	"github.com/faiface/beep/speaker"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	err := speaker.Init(beep.SampleRate(44100), beep.SampleRate(44100).N(time.Second/10))
	if err != nil {
		log.Fatal(err)
	}
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) PlayAlarm() {
	f, err := os.Open("audio/success.mp3")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	st, _, err := mp3.Decode(f)
	if err != nil {
		log.Fatal(err)
	}
	defer st.Close()

	done := make(chan bool)
	speaker.Play(beep.Seq(st, beep.Callback(func() {
		done <- true
	})))
	<-done
}
