from kivy.app import App
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.properties import StringProperty, NumericProperty, ListProperty
from kivy.clock import Clock
import sqlite3
from datetime import date

KV = '''
ScreenManager:
    DashboardScreen:
    HabitsScreen:
    AddHabitScreen:
    ExpensesScreen:
    AddExpenseScreen:
    StatsScreen:

<MainLayout@BoxLayout>:
    orientation: 'vertical'
    padding: 10
    spacing: 10

<DashboardScreen>:
    name: 'dashboard'
    MainLayout:
        BoxLayout:
            size_hint_y: None
            height: '48dp'
            Label:
                text: 'EcoSpend Tracker'
                font_size: '20sp'
        BoxLayout:
            size_hint_y: None
            height: '120dp'
            spacing: 8
            canvas.before:
                Color:
                    rgba: .95, .98, .95, 1
                Rectangle:
                    pos: self.pos
                    size: self.size
            BoxLayout:
                orientation: 'vertical'
                Label:
                    text: 'Eco Points'
                    size_hint_y: None
                    height: '24dp'
                Label:
                    id: eco_points
                    text: root.eco_points_text
                    font_size: '24sp'
            BoxLayout:
                orientation: 'vertical'
                Label:
                    text: 'Pengeluaran'
                    size_hint_y: None
                    height: '24dp'
                Label:
                    id: expenses_total
                    text: root.expenses_text
                    font_size: '24sp'
            BoxLayout:
                orientation: 'vertical'
                Label:
                    text: 'Penghematan'
                    size_hint_y: None
                    height: '24dp'
                Label:
                    id: saving_est
                    text: root.saving_text
                    font_size: '24sp'
        BoxLayout:
            size_hint_y: None
            height: '40dp'
            spacing: 8
            Button:
                text: 'Habits'
                on_release: app.root.current = 'habits'
            Button:
                text: 'Expenses'
                on_release: app.root.current = 'expenses'
            Button:
                text: 'Stats'
                on_release: app.root.current = 'stats'

<HabitsScreen>:
    name: 'habits'
    MainLayout:
        BoxLayout:
            size_hint_y: None
            height: '48dp'
            Button:
                text: '< Back'
                size_hint_x: None
                width: '80dp'
                on_release: app.root.current = 'dashboard'
            Label:
                text: 'Habits'
        ScrollView:
            GridLayout:
                id: habits_list
                cols: 1
                size_hint_y: None
                height: self.minimum_height
                row_default_height: '56dp'
                row_force_default: True
        BoxLayout:
            size_hint_y: None
            height: '48dp'
            Button:
                text: 'Tambah Habit'
                on_release: app.root.current = 'addhabit'

<AddHabitScreen>:
    name: 'addhabit'
    MainLayout:
        BoxLayout:
            size_hint_y: None
            height: '48dp'
            Button:
                text: '< Back'
                size_hint_x: None
                width: '80dp'
                on_release: app.root.current = 'habits'
            Label:
                text: 'Tambah Habit'
        GridLayout:
            cols: 2
            size_hint_y: None
            height: '160dp'
            Label:
                text: 'Nama Habit:'
            TextInput:
                id: habit_name
                multiline: False
            Label:
                text: 'Poin per kali:'
            TextInput:
                id: habit_point
                multiline: False
            Label:
                text: 'Estimasi Hemat (Rp):'
            TextInput:
                id: habit_save
                multiline: False
        Button:
            text: 'Simpan'
            size_hint_y: None
            height: '40dp'
            on_release: root.save_habit(habit_name.text, habit_point.text, habit_save.text)

<ExpensesScreen>:
    name: 'expenses'
    MainLayout:
        BoxLayout:
            size_hint_y: None
            height: '48dp'
            Button:
                text: '< Back'
                size_hint_x: None
                width: '80dp'
                on_release: app.root.current = 'dashboard'
            Label:
                text: 'Expenses'
        BoxLayout:
            size_hint_y: None
            height: '48dp'
            TextInput:
                id: exp_amount
                hint_text: 'Nominal (angka)'
                multiline: False
            TextInput:
                id: exp_cat
                hint_text: 'Kategori'
                multiline: False
            Button:
                text: 'Tambah'
                on_release: root.add_expense(exp_amount.text, exp_cat.text)
        ScrollView:
            GridLayout:
                id: expense_list
                cols: 1
                size_hint_y: None
                height: self.minimum_height
                row_default_height: '48dp'
                row_force_default: True

<AddExpenseScreen>:
    name: 'addexpense'
    MainLayout:
        Label:
            text: 'TODO: separate screen if needed'

<StatsScreen>:
    name: 'stats'
    MainLayout:
        BoxLayout:
            size_hint_y: None
            height: '48dp'
            Button:
                text: '< Back'
                size_hint_x: None
                width: '80dp'
                on_release: app.root.current = 'dashboard'
            Label:
                text: 'Stats'
        Label:
            id: stats_label
            text: 'Ringkasan mingguan (placeholder)'
'''

# Database helper
DB_FILE = 'ecospend.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    # Habits table
    c.execute('''
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            point INTEGER DEFAULT 1,
            save_est INTEGER DEFAULT 0
        );
    ''')
    # Habit completions (date)
    c.execute('''
        CREATE TABLE IF NOT EXISTS habit_done (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER,
            done_date TEXT,
            UNIQUE(habit_id, done_date)
        );
    ''')
    # Expenses
    c.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount INTEGER,
            category TEXT,
            note TEXT,
            exp_date TEXT
        );
    ''')
    conn.commit()
    conn.close()

class DashboardScreen(Screen):
    eco_points_text = StringProperty('0')
    expenses_text = StringProperty('Rp0')
    saving_text = StringProperty('Rp0')

    def on_enter(self):
        self.update_dashboard()

    def update_dashboard(self):
        today = date.today().isoformat()
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        # total eco points today
        c.execute('''SELECT SUM(h.point) FROM habits h JOIN habit_done d ON h.id=d.habit_id WHERE d.done_date=?''', (today,))
        res = c.fetchone()[0]
        points = res if res else 0
        self.eco_points_text = str(points)
        # total expenses today
        c.execute('''SELECT SUM(amount) FROM expenses WHERE exp_date=?''', (today,))
        res2 = c.fetchone()[0]
        exp_total = res2 if res2 else 0
        self.expenses_text = f'Rp{exp_total:,}'.replace(',', '.')
        # total savings estimate from habits done today
        c.execute('''SELECT SUM(h.save_est) FROM habits h JOIN habit_done d ON h.id=d.habit_id WHERE d.done_date=?''', (today,))
        res3 = c.fetchone()[0]
        save_total = res3 if res3 else 0
        self.saving_text = f'Rp{save_total:,}'.replace(',', '.')
        conn.close()

class HabitsScreen(Screen):
    def on_enter(self):
        self.load_habits()

    def load_habits(self):
        layout = self.ids.habits_list
        layout.clear_widgets()
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('SELECT id, name, point, save_est FROM habits')
        rows = c.fetchall()
        today = date.today().isoformat()
        for r in rows:
            hid, name, point, save = r
            # check if done today
            c.execute('SELECT 1 FROM habit_done WHERE habit_id=? AND done_date=?', (hid, today))
            done = c.fetchone() is not None
            from kivy.uix.boxlayout import BoxLayout
            from kivy.uix.label import Label
            from kivy.uix.checkbox import CheckBox
            bl = BoxLayout(orientation='horizontal')
            cb = CheckBox(active=done)
            cb.bind(active=lambda instance, value, hid=hid: self.toggle_done(hid, value))
            bl.add_widget(cb)
            bl.add_widget(Label(text=f"{name}  (+{point})  EstRp{save}", halign='left'))
            layout.add_widget(bl)
        conn.close()

    def toggle_done(self, habit_id, value):
        today = date.today().isoformat()
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        if value:
            try:
                c.execute('INSERT INTO habit_done(habit_id, done_date) VALUES(?, ?)', (habit_id, today))
            except sqlite3.IntegrityError:
                pass
        else:
            c.execute('DELETE FROM habit_done WHERE habit_id=? AND done_date=?', (habit_id, today))
        conn.commit()
        conn.close()
        # update dashboard if present
        try:
            ds = self.manager.get_screen('dashboard')
            ds.update_dashboard()
        except Exception:
            pass

class AddHabitScreen(Screen):
    def save_habit(self, name, point, save_est):
        if not name or not point.isdigit():
            return
        p = int(point)
        s = int(save_est) if save_est.isdigit() else 0
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('INSERT INTO habits(name, point, save_est) VALUES(?,?,?)', (name, p, s))
        conn.commit()
        conn.close()
        self.manager.current = 'habits'

class ExpensesScreen(Screen):
    def on_enter(self):
        self.load_expenses()

    def add_expense(self, amount, category):
        if not amount or not amount.isdigit():
            return
        amt = int(amount)
        cat = category if category else 'Misc'
        today = date.today().isoformat()
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('INSERT INTO expenses(amount, category, note, exp_date) VALUES(?,?,?,?)', (amt, cat, '', today))
        conn.commit()
        conn.close()
        self.ids.exp_amount.text = ''
        self.ids.exp_cat.text = ''
        self.load_expenses()
        try:
            ds = self.manager.get_screen('dashboard')
            ds.update_dashboard()
        except Exception:
            pass

    def load_expenses(self):
        layout = self.ids.expense_list
        layout.clear_widgets()
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        today = date.today().isoformat()
        c.execute('SELECT amount, category, note FROM expenses WHERE exp_date=? ORDER BY id DESC', (today,))
        rows = c.fetchall()
        from kivy.uix.label import Label
        for r in rows:
            amt, cat, note = r
            layout.add_widget(Label(text=f"{cat} - Rp{amt:,}".replace(',', '.'), size_hint_y=None, height='48dp'))
        conn.close()

class AddExpenseScreen(Screen):
    pass

class StatsScreen(Screen):
    def on_enter(self):
        self.load_stats()

    def load_stats(self):
        # simple placeholder: show last 7 days summary
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        from datetime import timedelta
        out = ''
        for i in range(6, -1, -1):
            d = (date.today() - timedelta(days=i)).isoformat()
            c.execute('SELECT SUM(amount) FROM expenses WHERE exp_date=?', (d,))
            s = c.fetchone()[0] or 0
            c.execute('SELECT SUM(h.save_est) FROM habits h JOIN habit_done d2 ON h.id=d2.habit_id WHERE d2.done_date=?', (d,))
            save = c.fetchone()[0] or 0
            out += f"{d}: Pengeluaran Rp{s:,} | Penghematan Rp{save:,}\n".replace(',', '.')
        self.ids.stats_label.text = out
        conn.close()

class EcoSpendApp(App):
    def build(self):
        init_db()
        root = Builder.load_string(KV)
        # set initial data
        return root

if __name__ == '__main__':
    EcoSpendApp().run()
