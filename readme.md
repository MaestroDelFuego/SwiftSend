# Secure File Transfer

A secure file transfer solution that encrypts files, tracks download progress, and monitors download speed and time. The tool allows easy and safe sharing of files with password protection.

---

## Features

- **End-to-End Encryption**: Files are encrypted using AES-256-CBC encryption for secure transfer.
- **Password Protection**: The file transfer is protected by a password, ensuring only authorized users can access the content.
- **Real-Time Download Monitoring**: The client displays download progress, speed, and time remaining.
- **Cross-Platform**: Works across different platforms, including Windows, macOS, and Linux.
- **Customizable File Name**: Users can choose the name for the file they are downloading.

---

## Security Considerations:

While **AES-256-CBC** provides strong encryption, ensure you address the following to maintain the integrity and confidentiality of your data:

- **Key Exchange**: The encryption key must be shared securely. Avoid transmitting the key over insecure channels (e.g., email). Consider using secure key exchange mechanisms.
- **Initialization Vector (IV)**: Each encryption operation should use a unique IV. The server sends the IV as part of the response headers to ensure proper decryption.
- **Authentication**: AES-CBC does not provide built-in integrity checks. For enhanced security, consider using authenticated encryption modes like **AES-GCM**, which provide both encryption and integrity protection.
- **Secure Transport**: Ensure that the connection is secured with **TLS/SSL** (use HTTPS) to protect the data during transit, even if the file is encrypted.

For highly sensitive data, it’s recommended to use an authenticated encryption mode like **AES-GCM** and a secure key exchange method to further protect the data.

---

## Disclaimer:## 
This tool is for local file transfers. I am not responsible for any files shared using this tool. Ensure you have proper authorization and permission to share any data. Use at your own risk.

## Installation

### Prerequisites

- Node.js (version 12 or higher)
