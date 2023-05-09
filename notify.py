from PyQt5.QtCore import QUrl
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView
import os

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Notify")
        self.web_view = QWebEngineView()
        self.setCentralWidget(self.web_view)
        self.load_app()
        self.setGeometry(0, 0, 1366, 768)

    def load_app(self):
        current_dir = os.path.dirname(os.path.realpath(__file__))
        url = QUrl.fromLocalFile(os.path.join(current_dir, "index.html"))
        self.web_view.load(url)

if __name__ == "__main__":
    app = QApplication([])
    window = MainWindow()
    window.show()
    app.exec_()
