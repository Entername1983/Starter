import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from jinja2 import Environment, FileSystemLoader


class EmailService:
    def __init__(self, smtp_server: str, smtp_port: int, smtp_username: str, smtp_password: str):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_username = smtp_username
        self.smtp_password = smtp_password
        # Load pre-compiled HTML templates
        self.jinja_env = Environment(loader=FileSystemLoader("templates/html"))

    def render_html_template(self, template_name: str, **kwargs) -> str:
        """Render HTML template with variables using Jinja2"""
        html_template = self.jinja_env.get_template(template_name)
        return html_template.render(**kwargs)

    def send_email(self, to_email: str, subject: str, html_content: str):
        """Send HTML email"""
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.smtp_username
        msg["To"] = to_email

        # Attach HTML content
        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)

        # Send email
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)

    def send_confirmation_email(
        self, to_email: str, username: str, confirmation_token: str, base_url: str
    ):
        """Send email confirmation using pre-compiled HTML template"""
        confirmation_link = f"{base_url}/confirm-email?token={confirmation_token}"

        html_content = self.render_html_template(
            "email_confirmation.html",
            username=username,
            confirmation_link=confirmation_link,
            project_name="Your App Name",
        )

        self.send_email(
            to_email=to_email,
            subject="Please confirm your email address",
            html_content=html_content,
        )
