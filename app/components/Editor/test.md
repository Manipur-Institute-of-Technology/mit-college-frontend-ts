# Gradient Descent and Its Variants

## Introduction

In machine learning, optimization is a key process to find the best model parameters that minimize or maximize a specific objective function. One of the most widely used optimization algorithms is **Gradient Descent**. It is used to minimize the loss (or cost) function, which measures the difference between the predicted output and the actual output in models such as linear regression, logistic regression, and deep learning networks.

In this article, we will explore the basic concept of Gradient Descent and then delve into its various variants, including **Stochastic Gradient Descent (SGD)**, **Mini-batch Gradient Descent**, and advanced methods like **Momentum**, **RMSProp**, and **Adam**.

## 1. Gradient Descent: Overview

### Objective

Gradient Descent aims to find the minimum of a function by iteratively moving in the direction of the steepest decrease in the function's value, which is the negative of the gradient of the function.

### The Gradient Descent Algorithm

Given a cost function \( J(\theta) \) that depends on parameters \( \theta \), the gradient descent algorithm can be described by the following update rule:

$\sum_{i=1}^{n} x_i = \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2$

$\theta_{t+1} = \theta_t - \alpha \nabla_\theta J(\theta_t)$

$\sum_{i=1}^{n} x_i = \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2$

Where:

- \( \theta_t \) represents the current parameters.
- \( \alpha \) is the learning rate, which controls the step size.
- \( \nabla_\theta J(\theta_t) \) is the gradient of the cost function with respect to the parameters at time step \( t \).

### Convergence of Gradient Descent

- **Local Minimum**: Gradient Descent can only guarantee convergence to a local minimum, not necessarily the global minimum.
- **Learning Rate**: Choosing the appropriate learning rate is crucial. If it's too small, convergence will be slow, and if it's too large, the algorithm may overshoot the minimum or even diverge.

## 2. Stochastic Gradient Descent (SGD)

### Overview

In **Stochastic Gradient Descent (SGD)**, instead of computing the gradient of the cost function over the entire dataset (as in traditional gradient descent), we compute it for a single training example at a time. This reduces the computational cost per iteration, but introduces more noise and variability in the updates.

The update rule in SGD is as follows:

$\theta_{t+1} = \theta_t - \alpha \nabla_\theta J(\theta_t; x^{(i)}, y^{(i)})$

Where:

- \( x^{(i)}, y^{(i)} \) are the \( i \)-th training example and label.

### Advantages of SGD

- **Faster Updates**: Because it updates the parameters more frequently (once per training example), it can be faster in practice.
- **Escaping Local Minima**: The noise introduced by stochasticity helps the algorithm potentially escape local minima and reach a global minimum.

### Disadvantages of SGD

- **Variance in Updates**: Since each update is based on a single data point, the path to the minimum is much noisier.
- **Convergence**: Convergence is less smooth compared to batch gradient descent. However, with a decaying learning rate, SGD can converge to a good solution over time.

## 3. Mini-Batch Gradient Descent

### Overview

Mini-batch Gradient Descent is a hybrid between **Batch Gradient Descent** and **Stochastic Gradient Descent**. Instead of using the entire dataset for each update or a single example, we use a small batch of examples.

The update rule in Mini-batch Gradient Descent is:

$$
\theta_{t+1} = \theta_t - \alpha \nabla_\theta J(\theta_t; \{x^{(i_1)}, x^{(i_2)}, ..., x^{(i_b)}\}, \{y^{(i_1)}, y^{(i_2)}, ..., y^{(i_b)}\})
$$

Where:

- $\{x^{(i_1)}, x^{(i_2)}, ..., x^{(i_b)}\}$ is a mini-batch of size \( b \) (the batch size).
- $\{y^{(i_1)}, y^{(i_2)}, ..., y^{(i_b)}\}$ are the corresponding labels.

### Advantages of Mini-Batch Gradient Descent

- **Efficiency**: It strikes a balance between the computational efficiency of batch gradient descent and the fast convergence of SGD.
- **Stable Convergence**: The convergence is less noisy than in SGD, and it's much faster than batch gradient descent for large datasets.
- **Parallelization**: Mini-batches can be processed in parallel, making the algorithm well-suited for distributed computing.

## 4. Advanced Variants of Gradient Descent

While the basic gradient descent algorithm is useful, several modifications have been introduced to improve its performance, especially when training deep neural networks. These include **Momentum**, **RMSProp**, and **Adam**.

### 4.1 Momentum

Momentum is an enhancement that helps accelerate gradient descent by adding a fraction of the previous update to the current update. The update rule with momentum is:

$v_{t+1} = \beta v_t + (1 - \beta) \nabla_\theta J(\theta_t)$
$\theta_{t+1} = \theta_t - \alpha v_{t+1}$

Where:

- \( v_t \) is the velocity (the exponentially decaying average of past gradients).
- \( \beta \) is the momentum term, typically set between 0.5 and 0.9.

### 4.2 RMSProp

RMSProp (Root Mean Square Propagation) modifies the gradient descent algorithm by scaling the learning rate for each parameter based on the moving average of the squared gradients:

$v_{t+1} = \beta v_t + (1 - \beta) \nabla_\theta J(\theta_t)^2$
$\theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{v_{t+1} + \epsilon}} \nabla_\theta J(\theta_t)$

Where:

- \( v_t \) is the moving average of the squared gradients.
- \( \epsilon \) is a small constant to avoid division by zero.

### 4.3 Adam (Adaptive Moment Estimation)

Adam combines the advantages of both **Momentum** and **RMSProp**. It computes adaptive learning rates for each parameter by considering both the first moment (the mean) and the second moment (the uncentered variance) of the gradients:

$m_{t+1} = \beta_1 m_t + (1 - \beta_1) \nabla_\theta J(\theta_t)$

$v_{t+1} = \beta_2 v_t + (1 - \beta_2) \nabla_\theta J(\theta_t)^2$

$\hat{m}*{t+1} = \frac{m*{t+1}}{1 - \beta_1^t}$

$\hat{v}*{t+1} = \frac{v*{t+1}}{1 - \beta_2^t}$

$\theta_{t+1} = \theta_t - \frac{\alpha \hat{m}_{t+1}}{\sqrt{\hat{v}_{t+1}} + \epsilon}$



