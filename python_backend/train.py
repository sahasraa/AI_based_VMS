import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from facenet_pytorch import InceptionResnetV1

# Configurations
device = 'cuda' if torch.cuda.is_available() else 'cpu'
data_dir = "path_to_your_data"  # Replace with the path to your dataset
batch_size = 32
num_epochs = 10
learning_rate = 0.001
embedding_size = 512  # Default for InceptionResnetV1
num_classes = 10  # Adjust based on your dataset

# Step 1: Prepare the Dataset
transform = transforms.Compose([
    transforms.Resize((160, 160)),  # Resize to match InceptionResnetV1 input size
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),
])

train_dataset = datasets.ImageFolder(os.path.join(data_dir, 'train'), transform=transform)
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

val_dataset = datasets.ImageFolder(os.path.join(data_dir, 'val'), transform=transform)
val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

# Step 2: Load the Pretrained Model
model = InceptionResnetV1(pretrained=None, classify=False).to(device)
checkpoint = torch.load("20180402-114759-vggface2.pt", map_location=device)
filtered_checkpoint = {k: v for k, v in checkpoint.items() if not k.startswith("logits.")}
model.load_state_dict(filtered_checkpoint)

# Add a new classification head
model.classifier = nn.Sequential(
    nn.Linear(embedding_size, 256),
    nn.ReLU(),
    nn.Dropout(0.5),
    nn.Linear(256, num_classes)
).to(device)

# Step 3: Freeze the Base Layers (Optional)
for param in model.parameters():
    param.requires_grad = False
for param in model.classifier.parameters():  # Unfreeze the new classification head
    param.requires_grad = True

# Step 4: Set the Loss Function and Optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.classifier.parameters(), lr=learning_rate)

# Step 5: Training Loop
def train_model(model, train_loader, val_loader, criterion, optimizer, num_epochs):
    model.train()
    for epoch in range(num_epochs):
        train_loss = 0.0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            # Forward pass
            outputs = model(images)
            loss = criterion(outputs, labels)

            # Backward pass and optimization
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

        # Validation
        val_loss, val_acc = validate_model(model, val_loader, criterion)

        print(f"Epoch [{epoch+1}/{num_epochs}], "
              f"Train Loss: {train_loss/len(train_loader):.4f}, "
              f"Val Loss: {val_loss:.4f}, Val Accuracy: {val_acc:.2f}%")

# Step 6: Validation Loop
def validate_model(model, val_loader, criterion):
    model.eval()
    val_loss = 0.0
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()

            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    accuracy = 100 * correct / total
    return val_loss / len(val_loader), accuracy

# Step 7: Save the Fine-Tuned Model
def save_model(model, path="fine_tuned_model.pth"):
    torch.save(model.state_dict(), path)
    print(f"Model saved to {path}")

# Execute the Training
train_model(model, train_loader, val_loader, criterion, optimizer, num_epochs)
save_model(model)
